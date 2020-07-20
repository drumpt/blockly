// from: https://github.com/lfelipesv/test_world_3d/blob/template-block-code/examples/

var DQN = 
'#!/usr/bin/python3\n'
+ '\n'
+ '# Author(s): Luiz Felipe Vecchietti, Kyujin Choi, Taeyoung Kim\n'
+ '# Maintainer: Kyujin Choi (nav3549@kaist.ac.kr)\n'
+ '\n'
+ 'from networks import Agent\n'
+ 'import torch\n'
+ 'import torch.nn as nn\n'
+ 'import torch.nn.functional as F\n'
+ 'import torch.optim as optim\n'
+ 'from copy import deepcopy\n'
+ 'import numpy as np\n'
+ '\n'
+ 'import helper\n'
+ 'import os\n'
+ 'from episode_memory import Memory\n'
+ 'import random\n'
+ 'import json\n'
+ '\n'
+ 'def update_target_model(net, target_net):\n'
+ '    target_net.load_state_dict(net.state_dict())\n'
+ '\n'
+ 'class DQN:\n'
+ '    def __init__(self, n_agents, dim_obs, dim_act, CHECKPOINT, load=False, play=False):\n'
+ '        params_file = open(os.path.dirname(__file__) + \'/parameters.json\')\n'
+ '        params = json.loads(params_file.read())\n'
+ '        self.agent_id = n_agents # id of robots\n'
+ '        self.CHECKPOINT = CHECKPOINT # this option for multi-agent RL\n'
+ '        self._iterations = 0\n'
+ '        self.update_steps = 100 # Update Target Network\n'
+ '        self.epsilon_steps = params[\'iql_parameters\'][\'epsilon_steps\'] # Decrease epsilon\n'
+ '        self.play = play\n'
+ '        if self.play == True:\n'
+ '            self.epsilon = 0 # Greedy choice if play is True\n'
+ '        else:\n'
+ '            self.epsilon = 0.95 # Initial epsilon value      \n'
+ '        self.final_epsilon = 0.05 # Final epsilon value\n'
+ '        self.dec_epsilon =  0.025 # Decrease rate of epsilon for every generation\n'
+ '\n'
+ '        self.observation_steps = 300 # Number of iterations to observe before training every generation\n'
+ '        self.save_num = 10000 # Save checkpoint # default: 100\n'
+ '        self.batch_size = params[\'iql_parameters\'][\'batch_size\']\n'
+ '        self.discount_factor = 0.99\n'
+ '\n'
+ '        self.num_inputs = dim_obs\n'
+ '        self.act_size = dim_act\n'
+ '        self.memory = Memory(params[\'iql_parameters\'][\'buffer_size\']) # replay buffer\n'
+ '        self.net = Agent(self.num_inputs, self.act_size)\n'
+ '        self.target_net = Agent(self.num_inputs, self.act_size)\n'
+ '        self.load = load\n'
+ '        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")\n'
+ '        if self.load == True:\n'
+ '            self.net.load_state_dict(torch.load(CHECKPOINT, map_location=torch.device(self.device)))\n'
+ '            helper.printConsole("loading variables...")\n'
+ '        \n'
+ '        update_target_model(self.net, self.target_net)\n'
+ '        self.net.train()\n'
+ '        self.target_net.train()\n'
+ '        self.net.to(self.device)\n'
+ '        self.target_net.to(self.device)\n'
+ '        self.gamma = params[\'iql_parameters\'][\'gamma\']\n'
+ '        self.grad_norm_clip = params[\'iql_parameters\'][\'grad_norm_clip\']\n'
+ '        self.loss = 0\n'
+ '        self.lr = params[\'iql_parameters\'][\'lr\']\n'
+ '        self.optimizer = optim.Adam(self.net.parameters(), lr=self.lr)    \n'
+ '\n'
+ '    def select_action(self, state):\n'
+ '\n'
+ '        state = torch.Tensor(state).to(self.device)\n'
+ '        \n'
+ '        qvalue = self.net(state)\n'
+ '        qvalue = qvalue.cpu().data.numpy()\n'
+ '        \n'
+ '        pick_random = int(np.random.rand() <= self.epsilon)\n'
+ '        random_actions = random.randrange(self.act_size)\n'
+ '        picked_actions = pick_random * random_actions + (1 - pick_random) * np.argmax(qvalue)\n'
+ '        return picked_actions\n'
+ '\n'
+ '    def store_experience(self, state, next_state, act, rew):\n'
+ '        # Store transition in the replay buffer.\n'
+ '        self.memory.push(state, next_state, act, rew)\n'
+ '\n'
+ '    def update_policy(self):\n'
+ '\n'
+ '        batch = self.memory.sample(self.batch_size)\n'
+ '\n'
+ '        states = torch.Tensor(batch.state).to(self.device)\n'
+ '        next_states = torch.Tensor(batch.next_state).to(self.device)\n'
+ '        actions = torch.Tensor(batch.action).long().to(self.device)\n'
+ '        rewards = torch.Tensor(batch.reward).to(self.device)\n'
+ '\n'
+ '        q_values = self.net(states).squeeze(1)\n'
+ '        max_next_q_values = self.target_net(next_states).squeeze(1).max(1)[0]\n'
+ '\n'
+ '        one_hot_action = torch.zeros(self.batch_size, q_values.size(-1)).to(self.device)\n'
+ '        one_hot_action.scatter_(1, actions.unsqueeze(1), 1)\n'
+ '        chosen_q_values = torch.sum(q_values.mul(one_hot_action), dim=1)\n'
+ '\n'
+ '        target = rewards + self.discount_factor * max_next_q_values\n'
+ '\n'
+ '        td_error = (chosen_q_values - target.detach())\n'
+ '        loss = (td_error ** 2).sum() \n'
+ '        self.loss = loss.cpu().data.numpy()\n'
+ '        \n'
+ '        self.optimizer.zero_grad()\n'
+ '        loss.backward()\n'
+ '        grad_norm = torch.nn.utils.clip_grad_norm_(self.net.parameters(), self.grad_norm_clip)\n'
+ '        self.optimizer.step()\n'
+ '        \n'
+ '        if self._iterations  % self.update_steps == 0: \n'
+ '            update_target_model(self.net, self.target_net)\n'
+ '            helper.printConsole("Updated target model.")\n'
+ '\n'
+ '        if self._iterations  % self.epsilon_steps == 0: \n'
+ '            self.epsilon = max(self.epsilon - self.dec_epsilon, self.final_epsilon)\n'
+ '            helper.printConsole("New Episode! New Epsilon:" + str(self.epsilon))\n'
+ '\n'
+ '        return self.loss        \n'
+ '\n'
+ '    def save_checkpoint(self, iteration):\n'
+ '        if iteration % self.save_num ==0:\n'
+ '            self.net.save_model(self.net, self.CHECKPOINT)\n'
+ '            helper.printConsole("Saved Checkpoint.")\n'
+ '\n'
+ '    def print_loss(self, loss, iteration):\n'
+ '        if self._iterations % 100 == 0: # Print information every 100 iterations\n'
+ '            helper.printConsole("======================================================")\n'
+ '            helper.printConsole("Agent: " + str(self.agent_id))\n'
+ '            helper.printConsole("Epsilon: " + str(self.epsilon))\n'
+ '            helper.printConsole("iterations: " + str(self._iterations))\n'
+ '            helper.printConsole("Loss: " + str(loss))\n'
+ '            helper.printConsole("======================================================")\n'
+ '\n'
+ '    def update(self):\n'
+ '        if len(self.memory) > self.observation_steps:\n'
+ '            self._iterations += 1\n'
+ '            loss = self.update_policy()\n'
+ '            self.print_loss(loss, self._iterations)\n';

var EPISODE_MEMORY = 
'#!/usr/bin/python3\n'
+ '\n'
+ '# Author(s): Luiz Felipe Vecchietti, Kyujin Choi, Taeyoung Kim\n'
+ '# Maintainer: Kyujin Choi (nav3549@kaist.ac.kr)\n'
+ '\n'
+ 'import random\n'
+ 'from collections import namedtuple\n'
+ '\n'
+ 'Transition = namedtuple(\'Transition\', (\'state\', \'next_state\', \'action\', \'reward\'))\n'
+ '\n'
+ 'class Memory(object):\n'
+ '    def __init__(self, capacity):\n'
+ '        self.memory = []\n'
+ '        self.capacity = capacity\n'
+ '        self.position = 0\n'
+ '\n'
+ '    def push(self, state, next_state, action, reward):\n'
+ '\n'
+ '        if len(self.memory) < self.capacity:\n'
+ '            self.memory.append(Transition(state, next_state, action, reward))\n'
+ '        self.memory[self.position] = Transition(state, next_state, action, reward)\n'
+ '        self.position = (self.position + 1) % self.capacity\n'
+ '\n'
+ '    def sample(self, batch_size):\n'
+ '        transitions = random.sample(self.memory, batch_size)\n'
+ '        batch = Transition(*zip(*transitions))\n'
+ '        return batch\n'
+ '\n'
+ '    def __len__(self):\n'
+ '        return len(self.memory)\n';

var HELPER = 
'#!/usr/bin/python3\n'
+ '\n'
+ '# Author(s): Luiz Felipe Vecchietti, Kyujin Choi, Taeyoung Kim\n'
+ '# Maintainer: Kyujin Choi (nav3549@kaist.ac.kr)\n'
+ '\n'
+ 'import os\n'
+ 'import sys\n'
+ 'sys.path.append(os.path.dirname(os.path.realpath(__file__)) + \'/../common\')\n'
+ 'try:\n'
+ '    from participant import Participant, Game, Frame\n'
+ 'except ImportError as err:\n'
+ '    print(\'player_random-walk: "participant" module cannot be imported:\', err)\n'
+ '    raise\n'
+ '\n'
+ 'import math\n'
+ '\n'
+ '#reset_reason\n'
+ 'NONE = Game.NONE\n'
+ 'GAME_START = Game.GAME_START\n'
+ 'SCORE_MYTEAM = Game.SCORE_MYTEAM\n'
+ 'SCORE_OPPONENT = Game.SCORE_OPPONENT\n'
+ 'GAME_END = Game.GAME_END\n'
+ 'DEADLOCK = Game.DEADLOCK\n'
+ 'GOALKICK = Game.GOALKICK\n'
+ 'CORNERKICK = Game.CORNERKICK\n'
+ 'PENALTYKICK = Game.PENALTYKICK\n'
+ 'HALFTIME = Game.HALFTIME\n'
+ 'EPISODE_END = Game.EPISODE_END\n'
+ '\n'
+ '#game_state\n'
+ 'STATE_DEFAULT = Game.STATE_DEFAULT\n'
+ 'STATE_KICKOFF = Game.STATE_KICKOFF\n'
+ 'STATE_GOALKICK = Game.GOALKICK\n'
+ 'STATE_CORNERKICK = Game.CORNERKICK\n'
+ 'STATE_PENALTYKICK = Game.STATE_PENALTYKICK\n'
+ '\n'
+ '#coordinates\n'
+ 'MY_TEAM = Frame.MY_TEAM\n'
+ 'OP_TEAM = Frame.OP_TEAM\n'
+ 'BALL = Frame.BALL\n'
+ 'X = Frame.X\n'
+ 'Y = Frame.Y\n'
+ 'Z = Frame.Z\n'
+ 'TH = Frame.TH\n'
+ 'ACTIVE = Frame.ACTIVE\n'
+ 'TOUCH = Frame.TOUCH\n'
+ 'BALL_POSSESSION = Frame.BALL_POSSESSION\n'
+ '\n'
+ 'def distance(x1, x2, y1, y2):\n'
+ '    return math.sqrt(math.pow(x1 - x2, 2) + math.pow(y1 - y2, 2))\n'
+ '\n'
+ 'def get_defense_kick_angle(predicted_ball, field, cur_ball):\n'
+ '    if predicted_ball[X] >= -field[X] / 2:\n'
+ '        x = -field[X] / 2 - predicted_ball[X]\n'
+ '    else:\n'
+ '        x = -field[X] / 2 - cur_ball[X]\n'
+ '    y = predicted_ball[Y]\n'
+ '    return math.atan2(y, abs(x) + 0.00001)\n'
+ '\n'
+ 'def printConsole(message):\n'
+ '    print(message)\n'
+ '    sys.__stdout__.flush()\n';

var NETWORKS = 
'#!/usr/bin/python3'
+ '\n'
+ '# Author(s): Luiz Felipe Vecchietti, Kyujin Choi, Taeyoung Kim\n'
+ '# Maintainer: Kyujin Choi (nav3549@kaist.ac.kr)\n'
+ '\n'
+ 'import torch\n'
+ 'import torch.nn as nn\n'
+ 'import torch.nn.functional as F\n'
+ '\n'
+ 'import os\n'
+ 'import json\n'
+ '\n'
+ 'class Agent(nn.Module):\n'
+ '    def __init__(self, num_inputs, num_outputs):\n'
+ '        super(Agent, self).__init__()\n'
+ '        params_file = open(os.path.dirname(__file__) + \'/parameters.json\')\n'
+ '        params = json.loads(params_file.read())\n'
+ '        self.hidden_dim = params[\'agent_parameters\'][\'hidden_dim\']\n'
+ '        self.input_linear = torch.nn.Linear(num_inputs, self.hidden_dim)\n'
+ '        self.middle_linear = torch.nn.Linear(self.hidden_dim, self.hidden_dim)\n'
+ '        self.output_linear = torch.nn.Linear(self.hidden_dim, num_outputs)\n'
+ '        self.num_layers = 3\n'
+ '\n'
+ '    def forward(self, x):\n'
+ '\n'
+ '        h_relu = self.input_linear(x).clamp(min=0)\n'
+ '        for _ in range(0, self.num_layers):\n'
+ '            h_relu = self.middle_linear(h_relu).clamp(min=0)\n'
+ '        q_pred = self.output_linear(h_relu)\n'
+ '        return q_pred\n'
+ '\n'
+ '    def save_model(self, net, filename):\n'
+ '        torch.save(net.state_dict(), filename)\n';

var PLAY = 
'#!/usr/bin/python3\n'
+ '\n'
+ '# Author(s): Luiz Felipe Vecchietti, Kyujin Choi, Taeyoung Kim\n'
+ '# Maintainer: Kyujin Choi (nav3549@kaist.ac.kr)\n'
+ '\n'
+ 'import random\n'
+ 'import os\n'
+ 'import sys\n'
+ 'sys.path.append(os.path.dirname(os.path.realpath(__file__)) + \'/../common\')\n'
+ 'try:\n'
+ '    from participant import Participant, Game, Frame\n'
+ 'except ImportError as err:\n'
+ '    print(\'player_random-walk: "participant" module cannot be imported:\', err)\n'
+ '    raise\n'
+ '\n'
+ 'import sys\n'
+ '\n'
+ 'import math\n'
+ 'import numpy as np\n'
+ 'import json\n'
+ '\n'
+ 'import helper\n'
+ 'from dqn import DQN\n'
+ 'from rl_utils import  get_action, get_state\n'
+ '\n'
+ '#reset_reason\n'
+ 'NONE = Game.NONE\n'
+ 'GAME_START = Game.GAME_START\n'
+ 'SCORE_MYTEAM = Game.SCORE_MYTEAM\n'
+ 'SCORE_OPPONENT = Game.SCORE_OPPONENT\n'
+ 'GAME_END = Game.GAME_END\n'
+ 'DEADLOCK = Game.DEADLOCK\n'
+ 'GOALKICK = Game.GOALKICK\n'
+ 'CORNERKICK = Game.CORNERKICK\n'
+ 'PENALTYKICK = Game.PENALTYKICK\n'
+ 'HALFTIME = Game.HALFTIME\n'
+ 'EPISODE_END = Game.EPISODE_END\n'
+ '\n'
+ '#game_state\n'
+ 'STATE_DEFAULT = Game.STATE_DEFAULT\n'
+ 'STATE_KICKOFF = Game.STATE_KICKOFF\n'
+ 'STATE_GOALKICK = Game.GOALKICK\n'
+ 'STATE_CORNERKICK = Game.CORNERKICK\n'
+ 'STATE_PENALTYKICK = Game.STATE_PENALTYKICK\n'
+ '\n'
+ '#coordinates\n'
+ 'MY_TEAM = Frame.MY_TEAM\n'
+ 'OP_TEAM = Frame.OP_TEAM\n'
+ 'BALL = Frame.BALL\n'
+ 'X = Frame.X\n'
+ 'Y = Frame.Y\n'
+ 'Z = Frame.Z\n'
+ 'TH = Frame.TH\n'
+ 'ACTIVE = Frame.ACTIVE\n'
+ 'TOUCH = Frame.TOUCH\n'
+ 'BALL_POSSESSION = Frame.BALL_POSSESSION\n'
+ '\n'
+ '#robot_index\n'
+ 'GK_INDEX = 0 \n'
+ 'D1_INDEX = 1 \n'
+ 'D2_INDEX = 2 \n'
+ 'F1_INDEX = 3 \n'
+ 'F2_INDEX = 4\n'
+ '\n'
+ '#robot_training_checkpoint\n'
+ 'CHECKPOINT_GK= os.path.join(os.path.dirname(__file__), \'models/policy_gk.pt\')\n'
+ 'CHECKPOINT_D1= os.path.join(os.path.dirname(__file__), \'models/policy_d1.pt\')\n'
+ 'CHECKPOINT_D2= os.path.join(os.path.dirname(__file__), \'models/policy_d2.pt\')\n'
+ 'CHECKPOINT_F1= os.path.join(os.path.dirname(__file__), \'models/policy_f1.pt\')\n'
+ 'CHECKPOINT_F2= os.path.join(os.path.dirname(__file__), \'models/policy_f2.pt\')\n'
+ 'CHECKPOINT = [CHECKPOINT_GK, CHECKPOINT_D1, CHECKPOINT_D2, CHECKPOINT_F1, CHECKPOINT_F2]\n'
+ '\n'
+ 'class Frame(object):\n'
+ '    def __init__(self):\n'
+ '        self.time = None\n'
+ '        self.score = None\n'
+ '        self.reset_reason = None\n'
+ '        self.game_state = None\n'
+ '        self.subimages = None\n'
+ '        self.coordinates = None\n'
+ '        self.half_passed = None\n'
+ '\n'
+ 'class Player(Participant):\n'
+ '    def init(self, info):\n'
+ '        params_file = open(os.path.dirname(__file__) + \'/parameters.json\')\n'
+ '        params = json.loads(params_file.read())\n'
+ '        self.field = info[\'field\']\n'
+ '        self.max_linear_velocity = info[\'max_linear_velocity\']\n'
+ '        self.goal = info[\'goal\']\n'
+ '        self.number_of_robots = info[\'number_of_robots\']\n'
+ '        self.end_of_frame = False\n'
+ '        self._frame = 0 \n'
+ '        self.wheels = [0 for _ in range(25)]\n'
+ '        self.cur_posture = []\n'
+ '        self.prev_posture = []\n'
+ '        self.cur_posture_opp = []\n'
+ '        self.cur_ball = []\n'
+ '        self.prev_ball = []\n'
+ '\n'
+ '        self.previous_frame = Frame()\n'
+ '        self.frame_skip = params[\'sim_parameters\'][\'frame_skip\'] # number of frames to skip\n'
+ '        self.obs_size = 3 # state size\n'
+ '        self.act_size = 7 # number of discrete actions\n'
+ '\n'
+ '        # for RL\n'
+ '        self.action = [0 for _ in range(self.number_of_robots)]\n'
+ '        self.previous_action = [0 for _ in range(self.number_of_robots)]\n'
+ '        self.state = [[0 for _ in range(self.obs_size)] for _ in range(self.number_of_robots)]\n'
+ '        self.previous_state = [[0 for _ in range(self.obs_size)] for _ in range(self.number_of_robots)]\n'
+ '\n'
+ '        self.num_inputs = self.obs_size\n'
+ '        # RL algorithm class\n'
+ '        self.load = True\n'
+ '        self.play = True\n'
+ '        if ( params[\'sim_parameters\'][\'algorithm\'] == \'iql\'):\n'
+ '            self.trainer =[DQN(role, self.obs_size, self.act_size, CHECKPOINT[role], self.load, self.play) for role in range(self.number_of_robots)]\n'
+ '\n'
+ '        helper.printConsole("Initializing variables...")\n'
+ '\n'
+ '    def get_coord(self, received_frame):\n'
+ '        self.cur_ball = received_frame.coordinates[BALL]\n'
+ '        self.cur_posture = received_frame.coordinates[MY_TEAM]\n'
+ '        self.cur_posture_opp = received_frame.coordinates[OP_TEAM]\n'
+ '        self.prev_posture = self.previous_frame.coordinates[MY_TEAM]\n'
+ '        self.prev_posture_opp = self.previous_frame.coordinates[OP_TEAM]\n'
+ '        self.prev_ball = self.previous_frame.coordinates[BALL]\n'
+ '\n'
+ '    def update(self, received_frame):\n'
+ '\n'
+ '        if received_frame.end_of_frame:\n'
+ '        \n'
+ '            self._frame += 1\n'
+ '\n'
+ '            if (self._frame == 1):\n'
+ '                self.previous_frame = received_frame\n'
+ '                self.get_coord(received_frame)\n'
+ '\n'
+ '            self.get_coord(received_frame)\n'
+ '\n'
+ '            if self._frame % self.frame_skip == 1:\n'
+ '        \n'
+ '                # Get reward and state\n'
+ '                state = get_state(self.cur_posture, self.prev_posture, self.cur_posture_opp, self.prev_posture_opp, self.cur_ball, self.prev_ball, self.field, self.goal, self.max_linear_velocity) \n'
+ '\n'
+ '                # select next action\n'
+ '                self.state = np.reshape([state],(self.number_of_robots, self.obs_size))\n'
+ '                self.action = [self.trainer[role].select_action(np.reshape([self.state[role]],(1, self.obs_size))) for role in range(self.number_of_robots)]\n'
+ '\n'
+ '            else:\n'
+ '                self.action = self.previous_action\n'
+ '\n'
+ '            # Set wheel speeds and send to the simulator\n'
+ '            for role in range(self.number_of_robots):\n'
+ '                self.wheels[5*role : 5*role + 5] = get_action(role, self.action[role])\n'
+ '\n'
+ '            self.set_speeds(self.wheels)\n'
+ '\n'
+ '            self.end_of_frame = False\n'
+ '            self.previous_action = self.action\n'
+ '            self.previous_frame = received_frame\n'
+ '\n'
+ 'if __name__ == \'__main__\':\n'
+ '    player = Player()\n'
+ '    player.run()\n';

var RL_UTILS = 
'#!/usr/bin/python3\n'
+ '\n'
+ '# Author(s): Luiz Felipe Vecchietti, Kyujin Choi, Taeyoung Kim\n'
+ '# Maintainer: Kyujin Choi (nav3549@kaist.ac.kr)\n'
+ '\n'
+ 'import os\n'
+ 'import sys\n'
+ '\n'
+ 'sys.path.append(os.path.dirname(os.path.realpath(__file__)) + \'/../common\')\n'
+ 'try:\n'
+ '    from participant import Participant, Game, Frame\n'
+ 'except ImportError as err:\n'
+ '    print(\'player_random-walk: "participant" module cannot be imported:\', err)\n'
+ '    raise\n'
+ '\n'
+ 'try:\n'
+ '    import _pickle as pickle\n'
+ 'except:\n'
+ '    import pickle\n'
+ 'import math\n'
+ 'import numpy as np\n'
+ 'import torch\n'
+ 'import matplotlib.pyplot as plt\n'
+ 'from torch.autograd import Variable\n'
+ '\n'
+ 'import helper\n'
+ '\n'
+ '#reset_reason\n'
+ 'NONE = Game.NONE\n'
+ 'GAME_START = Game.GAME_START\n'
+ 'SCORE_MYTEAM = Game.SCORE_MYTEAM\n'
+ 'SCORE_OPPONENT = Game.SCORE_OPPONENT\n'
+ 'GAME_END = Game.GAME_END\n'
+ 'DEADLOCK = Game.DEADLOCK\n'
+ 'GOALKICK = Game.GOALKICK\n'
+ 'CORNERKICK = Game.CORNERKICK\n'
+ 'PENALTYKICK = Game.PENALTYKICK\n'
+ 'HALFTIME = Game.HALFTIME\n'
+ 'EPISODE_END = Game.EPISODE_END\n'
+ '\n'
+ '#game_state\n'
+ 'STATE_DEFAULT = Game.STATE_DEFAULT\n'
+ 'STATE_KICKOFF = Game.STATE_KICKOFF\n'
+ 'STATE_GOALKICK = Game.GOALKICK\n'
+ 'STATE_CORNERKICK = Game.CORNERKICK\n'
+ 'STATE_PENALTYKICK = Game.STATE_PENALTYKICK\n'
+ '\n'
+ '#coordinates\n'
+ 'MY_TEAM = Frame.MY_TEAM\n'
+ 'OP_TEAM = Frame.OP_TEAM\n'
+ 'BALL = Frame.BALL\n'
+ 'X = Frame.X\n'
+ 'Y = Frame.Y\n'
+ 'TH = Frame.TH\n'
+ 'ACTIVE = Frame.ACTIVE\n'
+ 'TOUCH = Frame.TOUCH\n'
+ '\n'
+ '#robot_index\n'
+ 'GK_INDEX = 0\n'
+ 'D1_INDEX = 1\n'
+ 'D2_INDEX = 2\n'
+ 'F1_INDEX = 3\n'
+ 'F2_INDEX = 4\n'
+ '\n'
+ 'USE_CUDA = torch.cuda.is_available()\n'
+ 'FLOAT = torch.cuda.FloatTensor if USE_CUDA else torch.FloatTensor\n'
+ 'LONG = torch.cuda.LongTensor if USE_CUDA else torch.LongTensor\n'
+ '\n'
+ 'def predict_ball_velocity(cur_ball, prev_ball, ts):\n'
+ '    vx = (cur_ball[X] - prev_ball[X])/ts\n'
+ '    vy = (cur_ball[Y] - prev_ball[Y])/ts\n'
+ '    vd = math.atan2(vy, vx)\n'
+ '    vr = math.sqrt(math.pow(vx, 2) + math.pow(vy, 2))\n'
+ '    return [vd*180/math.pi, vr]\n'
+ '\n'
+ 'def predict_robot_velocity(cur_posture, prev_posture, index, ts):\n'
+ '    vx = (cur_posture[index][X] - prev_posture[index][X])/ts\n'
+ '    vy = (cur_posture[index][Y] - prev_posture[index][Y])/ts\n'
+ '    vd = math.atan2(vy, vx)\n'
+ '    vr = math.sqrt(math.pow(vx, 2) + math.pow(vy, 2))\n'
+ '    return [vd*180/math.pi, vr]\n'
+ '\n'
+ 'def get_state(cur_posture, prev_posture, cur_posture_opp, prev_posture_opp, cur_ball, prev_ball, field, goal, max_linear_velocity):\n'
+ '    # state: relative position to the ball and robot orientation\n'
+ '    states = [[] for _ in range(5)]\n'
+ '    pxx = field[X] + goal[X]\n'
+ '    pyy = field[Y] + goal[Y]\n'
+ '    defense_angle = helper.get_defense_kick_angle(cur_ball, field, cur_ball)\n'
+ '    defense_x = math.cos(defense_angle)*0.6 - field[X]/2\n'
+ '    defense_y = math.sin(defense_angle)*0.6\n'
+ '    for i in range(5):\n'
+ '        if i == 0:\n'
+ '            states[i] =[round((defense_x - cur_posture[i][X] )/pxx, 2), round((defense_y - cur_posture[i][Y] )/pyy, 2),  round(cur_posture[i][TH], 2)]\n'
+ '        else:\n'
+ '            states[i] =[round((cur_ball[X] - cur_posture[i][X] )/pxx, 2), round((cur_ball[Y] - cur_posture[i][Y] )/pyy, 2),  round(cur_posture[i][TH], 2)]\n'
+ '\n'
+ '    return states\n'
+ '\n'
+ 'def get_reward(cur_posture, prev_posture, cur_ball, prev_ball, field, id):\n'
+ '    dist_robot2ball = helper.distance(cur_posture[id][X] , cur_ball[X], cur_posture[id][Y], cur_ball[Y])\n'
+ '    defense_angle = helper.get_defense_kick_angle(cur_ball, field, cur_ball)\n'
+ '    defense_x = math.cos(defense_angle)*0.6 - field[X]/2\n'
+ '    defense_y = math.sin(defense_angle)*0.6\n'
+ '    defense_dis = helper.distance(cur_posture[id][X], defense_x, cur_posture[id][Y], defense_y) \n'
+ '    if id == 0:\n'
+ '        return -(1-math.exp(-1*defense_dis))\n'
+ '    else:\n'
+ '        return -(1-math.exp(-1*dist_robot2ball))\n'
+ '\n'
+ 'def get_action(robot_id, action_number):\n'
+ '    # 5 actions: go forwards, go backwards, rotate right, rotate left, stop\n'
+ '\n'
+ '    GK_WHEELS = [[1.5,  1.5,  0.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  5.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  0.0,  0.0,  5.0],\n'
+ '                [-1.5, -1.5,  0.0,  0.0,  0.0],\n'
+ '                [0.0,  0.0,  0.0,  0.0,  0.0],\n'
+ '                [1.0, -1.0,  0.0,  0.0,  0.0],\n'
+ '                [-1.0,  1.0,  0.0,  0.0,  0.0]]\n'
+ '\n'
+ '    D1_WHEELS = [[1.5,  1.5,  0.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  5.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  0.0,  0.0,  5.0],\n'
+ '                [-1.5, -1.5,  0.0,  0.0,  0.0],\n'
+ '                [0.0,  0.0,  0.0,  0.0,  0.0],\n'
+ '                [1.0, -1.0,  0.0,  0.0,  0.0],\n'
+ '                [-1.0,  1.0,  0.0,  0.0,  0.0]]\n'
+ '\n'
+ '    D2_WHEELS = [[1.5,  1.5,  0.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  5.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  0.0,  0.0,  5.0],\n'
+ '                [-1.5, -1.5,  0.0,  0.0,  0.0],\n'
+ '                [0.0,  0.0,  0.0,  0.0,  0.0],\n'
+ '                [1.0, -1.0,  0.0,  0.0,  0.0],\n'
+ '                [-1.0,  1.0,  0.0,  0.0,  0.0]]\n'
+ '\n'
+ '    F1_WHEELS = [[1.5,  1.5,  0.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  5.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  0.0,  0.0,  5.0],\n'
+ '                [-1.5, -1.5,  0.0,  0.0,  0.0],\n'
+ '                [0.0,  0.0,  0.0,  0.0,  0.0],\n'
+ '                [1.0, -1.0,  0.0,  0.0,  0.0],\n'
+ '                [-1.0,  1.0,  0.0,  0.0,  0.0]]\n'
+ '\n'
+ '    F2_WHEELS = [[1.5,  1.5,  0.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  5.0,  0.0,  0.0],\n'
+ '                [1.5,  1.5,  0.0,  0.0,  5.0],\n'
+ '                [-1.5, -1.5,  0.0,  0.0,  0.0],\n'
+ '                [0.0,  0.0,  0.0,  0.0,  0.0],\n'
+ '                [1.0, -1.0,  0.0,  0.0,  0.0],\n'
+ '                [-1.0,  1.0,  0.0,  0.0,  0.0]]\n'
+ '\n'
+ '    wheel = [GK_WHEELS, D1_WHEELS, D2_WHEELS, F1_WHEELS, F2_WHEELS]\n'
+ '\n'
+ '    return wheel[robot_id][action_number][0], wheel[robot_id][action_number][1], wheel[robot_id][action_number][2], wheel[robot_id][action_number][3], wheel[robot_id][action_number][4]\n'
+ '\n'
+ 'class Logger():\n'
+ '    def __init__(self):\n'
+ '\n'
+ '        self.episode = []\n'
+ '        self.m_episode = []\n'
+ '        self.value = []\n'
+ '        self.mean_value = []\n'
+ '\n'
+ '    def update(self, episode, value, num):\n'
+ '\n'
+ '        self.episode.append(episode)\n'
+ '        self.value.append(value)\n'
+ '        self.num = num\n'
+ '        if len(self.value) >= self.num :\n'
+ '            self.m_episode.append(episode - self.num/2)\n'
+ '            self.mean_value.append(np.mean(self.value[-self.num:]))\n'
+ '\n'
+ '    def plot(self, name):\n'
+ '        plt.title(str(name))\n'
+ '        plt.plot(self.episode, self.value, c = \'lightskyblue\', label=\'total_reward\') \n'
+ '        plt.plot(self.m_episode, self.mean_value, c = \'b\', label=\'Average_Total_Reward\') \n'
+ '        if len(self.episode) <= 10:\n'
+ '            plt.legend(loc=1)\n'
+ '        #plt.savefig(\'../../examples/player_deeplearning_multi-iql-dqn_py/TOTAL_\'+str(name)+\'.png\')\n';

var TRAIN = 
'#!/usr/bin/python3\n'
+ '\n'
+ '# Author(s): Luiz Felipe Vecchietti, Kyujin Choi, Taeyoung Kim\n'
+ '# Maintainer: Kyujin Choi (nav3549@kaist.ac.kr)\n'
+ '\n'
+ 'import random\n'
+ 'import os\n'
+ 'import sys\n'
+ 'sys.path.append(os.path.dirname(os.path.realpath(__file__)) + \'/../common\')\n'
+ 'try:\n'
+ '    from participant import Participant, Game, Frame\n'
+ 'except ImportError as err:\n'
+ '    print(\'player_random-walk: "participant" module cannot be imported:\', err)\n'
+ '    raise\n'
+ '\n'
+ 'import math\n'
+ 'import numpy as np\n'
+ 'import json\n'
+ '\n'
+ 'import helper\n'
+ 'from dqn import DQN\n'
+ 'from rl_utils import get_action, get_reward, get_state, Logger\n'
+ '\n'
+ '#reset_reason\n'
+ 'NONE = Game.NONE\n'
+ 'GAME_START = Game.GAME_START\n'
+ 'SCORE_MYTEAM = Game.SCORE_MYTEAM\n'
+ 'SCORE_OPPONENT = Game.SCORE_OPPONENT\n'
+ 'GAME_END = Game.GAME_END\n'
+ 'DEADLOCK = Game.DEADLOCK\n'
+ 'GOALKICK = Game.GOALKICK\n'
+ 'CORNERKICK = Game.CORNERKICK\n'
+ 'PENALTYKICK = Game.PENALTYKICK\n'
+ 'HALFTIME = Game.HALFTIME\n'
+ 'EPISODE_END = Game.EPISODE_END\n'
+ '\n'
+ '#game_state\n'
+ 'STATE_DEFAULT = Game.STATE_DEFAULT\n'
+ 'STATE_KICKOFF = Game.STATE_KICKOFF\n'
+ 'STATE_GOALKICK = Game.GOALKICK\n'
+ 'STATE_CORNERKICK = Game.CORNERKICK\n'
+ 'STATE_PENALTYKICK = Game.STATE_PENALTYKICK\n'
+ '\n'
+ '#coordinates\n'
+ 'MY_TEAM = Frame.MY_TEAM\n'
+ 'OP_TEAM = Frame.OP_TEAM\n'
+ 'BALL = Frame.BALL\n'
+ 'X = Frame.X\n'
+ 'Y = Frame.Y\n'
+ 'Z = Frame.Z\n'
+ 'TH = Frame.TH\n'
+ 'ACTIVE = Frame.ACTIVE\n'
+ 'TOUCH = Frame.TOUCH\n'
+ 'BALL_POSSESSION = Frame.BALL_POSSESSION\n'
+ '\n'
+ '#robot_index\n'
+ 'GK_INDEX = 0 \n'
+ 'D1_INDEX = 1 \n'
+ 'D2_INDEX = 2 \n'
+ 'F1_INDEX = 3 \n'
+ 'F2_INDEX = 4\n'
+ '\n'
+ '#robot_training_checkpoint\n'
+ 'CHECKPOINT_GK= os.path.join(os.path.dirname(__file__), \'policy_gk.pt\')\n'
+ 'CHECKPOINT_D1= os.path.join(os.path.dirname(__file__), \'policy_d1.pt\')\n'
+ 'CHECKPOINT_D2= os.path.join(os.path.dirname(__file__), \'policy_d2.pt\')\n'
+ 'CHECKPOINT_F1= os.path.join(os.path.dirname(__file__), \'policy_f1.pt\')\n'
+ 'CHECKPOINT_F2= os.path.join(os.path.dirname(__file__), \'policy_f2.pt\')\n'
+ 'CHECKPOINT = [CHECKPOINT_GK, CHECKPOINT_D1, CHECKPOINT_D2, CHECKPOINT_F1, CHECKPOINT_F2]\n'
+ '\n'
+ 'class Frame(object):\n'
+ '    def __init__(self):\n'
+ '        self.time = None\n'
+ '        self.score = None\n'
+ '        self.reset_reason = None\n'
+ '        self.game_state = None\n'
+ '        self.subimages = None\n'
+ '        self.coordinates = None\n'
+ '        self.half_passed = None\n'
+ '\n'
+ 'class Player(Participant):\n'
+ '    def init(self, info):\n'
+ '        params_file = open(os.path.dirname(__file__) + \'/parameters.json\')\n'
+ '        params = json.loads(params_file.read())\n'
+ '        self.field = info[\'field\']\n'
+ '        self.max_linear_velocity = info[\'max_linear_velocity\']\n'
+ '        self.goal = info[\'goal\']\n'
+ '        self.number_of_robots = info[\'number_of_robots\']\n'
+ '        self.end_of_frame = False\n'
+ '        self._frame = 0 \n'
+ '        self.wheels = [0 for _ in range(25)]\n'
+ '        self.cur_posture = []\n'
+ '        self.prev_posture = []\n'
+ '        self.cur_posture_opp = []\n'
+ '        self.cur_ball = []\n'
+ '        self.prev_ball = []\n'
+ '\n'
+ '        self.previous_frame = Frame()\n'
+ '        self.frame_skip = params[\'sim_parameters\'][\'frame_skip\'] # number of frames to skip\n'
+ '        self.obs_size = 3 # state size\n'
+ '        self.act_size = 7 # number of discrete actions\n'
+ '\n'
+ '        # for RL\n'
+ '        self.action = [0 for _ in range(self.number_of_robots)]\n'
+ '        self.previous_action = [0 for _ in range(self.number_of_robots)]\n'
+ '        self.state = [[0 for _ in range(self.obs_size)] for _ in range(self.number_of_robots)]\n'
+ '        self.previous_state = [[0 for _ in range(self.obs_size)] for _ in range(self.number_of_robots)]\n'
+ '        self.reward = [0 for _ in range(self.number_of_robots)]\n'
+ '        self.previous_reward = [0 for _ in range(self.number_of_robots)]\n'
+ '\n'
+ '        # RL algorithm class\n'
+ '        if ( params[\'sim_parameters\'][\'algorithm\'] == \'iql\'):\n'
+ '            self.trainer =[DQN(role, self.obs_size, self.act_size, CHECKPOINT[role]) for role in range(self.number_of_robots)]\n'
+ '        \n'
+ '        # log rewards\n'
+ '        self.total_reward = 0\n'
+ '        self.rew = np.zeros(4)\n'
+ '        # for loggint rewards\n'
+ '        self.t = 0\n'
+ '        self.episode = 1\n'
+ '        self.plot_reward = Logger()\n'
+ '        self.save_png_interval = 10\n'
+ '        helper.printConsole("Initializing variables...")\n'
+ '\n'
+ '    def get_coord(self, received_frame):\n'
+ '        self.cur_ball = received_frame.coordinates[BALL]\n'
+ '        self.cur_posture = received_frame.coordinates[MY_TEAM]\n'
+ '        self.cur_posture_opp = received_frame.coordinates[OP_TEAM]\n'
+ '        self.prev_posture = self.previous_frame.coordinates[MY_TEAM]\n'
+ '        self.prev_posture_opp = self.previous_frame.coordinates[OP_TEAM]\n'
+ '        self.prev_ball = self.previous_frame.coordinates[BALL]\n'
+ '\n'
+ '    def update(self, received_frame):\n'
+ '\n'
+ '        if received_frame.end_of_frame:\n'
+ '        \n'
+ '            self._frame += 1\n'
+ '\n'
+ '            if (self._frame == 1):\n'
+ '                self.previous_frame = received_frame\n'
+ '                self.get_coord(received_frame)\n'
+ '\n'
+ '            self.get_coord(received_frame)\n'
+ '\n'
+ '            if self._frame % self.frame_skip == 1:\n'
+ '        \n'
+ '                # Get reward and state\n'
+ '                self.reward = [get_reward(self.cur_posture, self.prev_posture, self.cur_ball, self.prev_ball, self.field, i) for i in range(self.number_of_robots)]\n'
+ '                state = get_state(self.cur_posture, self.prev_posture, self.cur_posture_opp, self.prev_posture_opp, self.cur_ball, self.prev_ball, self.field, self.goal, self.max_linear_velocity) \n'
+ '\n'
+ '                # select next action \n'
+ '                self.state = np.reshape([state],(self.number_of_robots, self.obs_size))\n'
+ '                self.action = [self.trainer[role].select_action(np.reshape([self.state[role]],(1, self.obs_size))) for role in range(self.number_of_robots)]\n'
+ '  \n'
+ '                self.total_reward += sum(self.reward)\n'
+ '                self.t += 1\n'
+ '\n'
+ '                # just store experiences if the robots are active\n'
+ '                for role in range(self.number_of_robots):\n'
+ '\n'
+ '                    if self.cur_posture[role][ACTIVE]:\n'
+ '                        if self._frame == 1:\n'
+ '                            self.trainer[role].store_experience(self.state[role], self.state[role], self.previous_action[role], self.previous_reward[role])\n'
+ '                        else:\n'
+ '                            self.trainer[role].store_experience(self.previous_state[role], self.state[role], self.previous_action[role], self.previous_reward[role])\n'
+ '\n'
+ '            else:\n'
+ '                self.action = self.previous_action\n'
+ '\n'
+ '            # Set wheel speeds and send to the simulator\n'
+ '            for role in range(self.number_of_robots):\n'
+ '                self.wheels[5*role : 5*role + 5] = get_action(role, self.action[role])\n'
+ '\n'
+ '            self.set_speeds(self.wheels)\n'
+ '\n'
+ '            for role in range(self.number_of_robots):\n'
+ '                # Training script: called every timestep\n'
+ '                self.trainer[role].update()\n'
+ '                # save checkpoint\n'
+ '                self.trainer[role].save_checkpoint(self._frame)\n'
+ '            \n'
+ '            # logging training agent\'s reward and plot graph \n'
+ '            if (received_frame.reset_reason > 1) :\n'
+ '\n'
+ '                if self.t >= 10:\n'
+ '                    mean_total_reward = self.total_reward/(self.t)\n'
+ '                    self.plot_reward.update(self.episode, mean_total_reward, 5)\n'
+ '                    if self.episode % self.save_png_interval == 0:\n'
+ '                        self.plot_reward.plot(\'DQN-AGENT-REWARD\') \n'
+ '                    self.episode += 1\n'
+ '                # reset episode timesteps and total reward \n'
+ '                self.t = 0\n'
+ '                self.total_reward = 0\n'
+ '\n'
+ '            # save to update the replay buffer in the next state\n'
+ '            self.previous_state = self.state\n'
+ '            self.previous_action = self.action\n'
+ '            self.previous_reward = self.reward\n'
+ '\n'
+ '            self.end_of_frame = False\n'
+ '            self.previous_frame = received_frame\n'
+ '\n'
+ 'if __name__ == \'__main__\':\n'
+ '    player = Player()\n'
+ '    player.run()\n';