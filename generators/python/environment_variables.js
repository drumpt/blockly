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
 * @fileoverview Generating Python for environment variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Python.Environment_variables');

goog.require('Blockly.Python');

Blockly.Python.addReservedWords('math,random,Number');

Blockly.Python['env_variables'] = function(block) {
  // Variables: id, idx, idx_opp, attack_angle, defense_angle.
  var CONSTANTS = {
    'ID': ['id', Blockly.Python.ORDER_MEMBER],
    'IDX': ['idx', Blockly.Python.ORDER_MEMBER],
    'IDX_OPP': ['idx_opp', Blockly.Python.ORDER_MEMBER],
    'ATTACK_ANGLE': ['attack_angle', Blockly.Python.ORDER_MEMBER],
    'DEFENSE_ANGLE': ['defense_angle', Blockly.Python.ORDER_MEMBER]
  };
  var constant = block.getFieldValue('CONSTANT');
  return CONSTANTS[constant];
};

Blockly.Python['env_variables_1d'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  arg = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_NONE);
  switch (operator) {
    case 'CUR_BALL':
      code = 'cur_ball[' + arg + ']';
      break;
    case 'PREDICTED_BALL':
      code = 'predicted_ball[' + arg + ']';
      break;
  }
  if (arg.length === 0) {
    code = code.replace("[", "").replace("]", "");
  }
  if (code) {
    return [code, Blockly.Python.ORDER_FUNCTION_CALL];
  }
};

Blockly.Python['env_variables_2d'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg1;
  var arg2;
  arg1 = Blockly.Python.valueToCode(block, 'NUM1', Blockly.Python.ORDER_NONE);
  arg2 = Blockly.Python.valueToCode(block, 'NUM2', Blockly.Python.ORDER_NONE);
  switch (operator) {
    case 'CUR_POSTURE':
      code = 'cur_posture[' + arg1 + ']' + '[' + arg2 + ']';
      break;
    case 'CUR_POSTURE_OPP':
      code = 'cur_posture_opp[' + arg1 + ']' + '[' + arg2 + ']';
      break;
  }
  if (arg1.length === 0 || arg2.length === 0) {
    // code = code.replace("[", "").replace("]", "");
    if (code.startsWith("cur_posture_opp")) code = "cur_posture_opp"
    else code = "cur_posture"
  }
  if (code) {
    return [code, Blockly.Python.ORDER_FUNCTION_CALL];
  }
};