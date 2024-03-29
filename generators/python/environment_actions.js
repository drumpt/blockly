/**
 * @license
 * Copyright 2012 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Python for environment function blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Python.Environment_actions');

goog.require('Blockly.Python');
  
// DEEP LEARNING

Blockly.Python['train'] = function(block) {
  var code = 'self.play = False\n';
  return code;
};

Blockly.Python['play'] = function(block) {
  var code = 'self.play = True\n';
  return code;
};

// RULE-BASED

Blockly.Python['stop'] = function(block) {
    var code = 'speeds = self.action.STOP()\n';
    return code;
  };

  Blockly.Python['go_forward'] = function(block) {
    var code = 'speeds = self.action.GO_FORWARD()\n';
    return code;
  };


  Blockly.Python['go_backward'] = function(block) {
    var code = 'speeds = self.action.GO_BACKWARD()\n';
    return code;
  };


  Blockly.Python['turn_right'] = function(block) {
    var code = 'speeds = self.action.TURN_RIGHT()\n';
    return code;
  };


  Blockly.Python['turn_left'] = function(block) {
    var code = 'speeds = self.action.TURN_LEFT()\n';
    return code;
  };

  Blockly.Python['kick'] = function(block) {
    var code = 'speeds = self.action.KICK()\n';
    return code;
  };

  Blockly.Python['kick_control'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var value_2 = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.KICK_CONTROL(" + value_1 + "," + value_2 + ")\n";
    return code;
  };

  Blockly.Python['jump_right_high'] = function(block) {
    var code = 'speeds = self.action.JUMP_RIGHT_HIGH()\n';
    return code;
  };

  Blockly.Python['jump_right_low'] = function(block) {
    var code = 'speeds = self.action.JUMP_RIGHT_LOW()\n';
    return code;
  };

  Blockly.Python['jump_center_high'] = function(block) {
    var code = 'speeds = self.action.JUMP_CENTER_HIGH()\n';
    return code;
  };

  Blockly.Python['jump_center_low'] = function(block) {
    var code = 'speeds = self.action.JUMP_CENTER_LOW()\n';
    return code;
  };

  Blockly.Python['jump_left_high'] = function(block) {
    var code = 'speeds = self.action.JUMP_LEFT_HIGH()\n';
    return code;
  };

  Blockly.Python['jump_left_low'] = function(block) {
    var code = 'speeds = self.action.JUMP_LEFT_LOW()\n';
    return code;
  };

  Blockly.Python['manual_control'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'left_wheel', Blockly.Python.ORDER_ATOMIC);
    var value_2 = Blockly.Python.valueToCode(block, 'right_wheel', Blockly.Python.ORDER_ATOMIC);
    var value_3 = Blockly.Python.valueToCode(block, 'kick_speed', Blockly.Python.ORDER_ATOMIC);
    var value_4 = Blockly.Python.valueToCode(block, 'kick_angle', Blockly.Python.ORDER_ATOMIC);
    var value_5 = Blockly.Python.valueToCode(block, 'jump_speed', Blockly.Python.ORDER_ATOMIC);
    var value_6 = Blockly.Python.valueToCode(block, 'dribble_mode', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.manual_control(" + value_1 + ", " + value_2 + ", " + value_3 + ", " + value_4 + ", " + value_5 + ", " + value_6 + ")\n";
    return code;
  };

  Blockly.Python['jump'] = function(block) {
    var code = 'speeds = self.action.jump()\n';
    return code;
  };

  Blockly.Python['go_to'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var value_2 = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.go_to(" + value_1 + "," + value_2 + ")\n";
    return code;
  };
  
  Blockly.Python['turn_to'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var value_2 = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.turn_to(" + value_1 + "," + value_2 + ")\n";
    return code;
  };
  
  Blockly.Python['shoot_to'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var value_2 = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.shoot_to(" + value_1 + "," + value_2 + ")\n";
    return code;
  };

  Blockly.Python['defend_ball'] = function(block) {
    var code = 'speeds = self.action.defend_ball()\n';
    return code;
  };

  Blockly.Python['is_gk_save_possible'] = function(block) {
    var code = 'self.action.is_gk_save_possible()';
    return [code, Blockly.Python.ORDER_NONE];
  };
  
  Blockly.Python['pass_to'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var value_2 = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.pass_to(" + value_1 + "," + value_2 + ")\n";
    return code;
  };

  Blockly.Python['pass_to_robot'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'robot_id', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.pass_to_robot(" + value_1 + ")\n";
    return code;
  };

  Blockly.Python['cross_to'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var value_2 = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
    var value_3 = Blockly.Python.valueToCode(block, 'z', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.cross_to(" + value_1 + "," + value_2 + "," + value_3 + ")\n";
    return code;
  };

  Blockly.Python['is_cross_to_possible'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var value_2 = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
    var value_3 = Blockly.Python.valueToCode(block, 'z', Blockly.Python.ORDER_ATOMIC);
    var code = "self.action.is_cross_to_possible(" + value_1 + "," + value_2 + "," + value_3 + ")";
    return [code, Blockly.Python.ORDER_NONE];
  };

  Blockly.Python['cross_to_robot'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'robot_id', Blockly.Python.ORDER_ATOMIC);
    var code = "speeds = self.action.cross_to_robot(" + value_1 + ")\n";
    return code;
  };

  Blockly.Python['is_cross_to_robot_possible'] = function(block) {
    var value_1 = Blockly.Python.valueToCode(block, 'robot_id', Blockly.Python.ORDER_ATOMIC);
    var code = "self.action.is_cross_to_robot_possible(" + value_1 + ")";
    return [code, Blockly.Python.ORDER_NONE];
  };

