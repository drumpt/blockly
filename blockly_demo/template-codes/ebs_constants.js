var PLAYERS_P1 = 
'# Author(s): Taeyoung Kim, Chansol Hong, Luiz Felipe Vecchietti'
+ '# Maintainer: Chansol Hong (cshong@rit.kaist.ac.kr)\n'
+ '\n'
+ 'import os\n'
+ 'import sys\n'
+ '\n'
+ 'sys.path.append(os.path.dirname(os.path.realpath(__file__)) + "/../common")\n'
+ 'try:\n'
+ '    from participant import Game, Frame\n'
+ 'except ImportError as err:\n'
+ '    print("player_rulebasedB: \'participant\' module cannot be imported", err)\n'
+ '    raise\n'
+ '\n'
+ 'import math\n'
+ '\n'
+ 'import helper\n'
+ 'from action import ActionControl\n'
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
+ 'class Forward_2:\n'
+ '\n'
+ '    def __init__(self, field, goal, penalty_area, goal_area, robot_size, max_linear_velocity, robot_id = 0):\n'
+ '        self.field = field\n'
+ '        self.goal = goal\n'
+ '        self.penalty_area = penalty_area\n'
+ '        self.goal_area = goal_area\n'
+ '        self.robot_size = robot_size\n'
+ '        self.max_linear_velocity = max_linear_velocity\n'
+ '        self.action = ActionControl(robot_id, max_linear_velocity)\n'
+ '        self.flag = 0\n'
+ '\n'
+ '    def move(self, robot_id, idx, idx_opp, defense_angle, attack_angle, cur_posture, cur_posture_opp, prev_posture, prev_posture_opp, prev_ball, cur_ball, predicted_ball, target=[0,0]):\n'
+ '        \n'
+ '        robot_to_target = helper.relative_distance(target[X], cur_posture[robot_id][X], target[Y], cur_posture[robot_id][Y])\n'
+ '        robot_to_ball = helper.relative_distance(cur_ball[X], cur_posture[robot_id][X], cur_ball[Y], cur_posture[robot_id][Y])\n'
+ '        robot_to_goal = helper.relative_distance(self.field[X]/2, cur_posture[robot_id][X], 0, cur_posture[robot_id][Y])\n'
+ '        self.action.update_state(cur_posture, prev_posture, cur_ball, prev_ball)\n'
+ '        speeds = self.action.STOP()\n'
+ '\n';

var PLAYERS_P2 = 
'\n'
+ '        return speeds\n';