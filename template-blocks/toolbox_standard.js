
var BLOCKLY_TOOLBOX_XML = BLOCKLY_TOOLBOX_XML || Object.create(null);

/* BEGINNING BLOCKLY_TOOLBOX_XML ASSIGNMENT. DO NOT EDIT. USE BLOCKLY DEVTOOLS. */
BLOCKLY_TOOLBOX_XML['standard'] =
// From XML string/file, replace ^\s?(\s*)?(<.*>)$ with \+$1'$2'
// Tweak first and last line.
'<xml xmlns="https://developers.google.com/blockly/xml">'
+ '<category name="Environment indices" colour="#d31900">'
+   '<block type="env_resetreason_index"></block>'
+   '<block type="env_gamestate_index"></block>'
+   '<block type="env_coordinates_index"></block>'
+ '</category>'
+ '<category name="Environment constants" colour="#ff8500">'
+   '<block type="env_constant_index"></block>'
+   '<block type="env_constant_noindex"></block>'
+ '</category>'
+ '<category name="Environment variables" colour="#ffdf00">'
+   '<block type="env_variables"></block>'
+   '<block type="env_variables_1d"></block>'
+   '<block type="env_variables_2d"></block>'
+ '</category>'
+ '<category name="Environment functions" colour="#b1dc57">'
+   '<block type="distance"></block>'
+   '<block type="degree2radian"></block>'
+   '<block type="radian2degree"></block>'
+   '<block type="predict_ball"></block>'
+   '<block type="find_closest_robot"></block>'
+   '<block type="ball_is_own_goal"></block>'
+   '<block type="ball_is_own_penalty"></block>'
+   '<block type="ball_is_own_field"></block>'
+   '<block type="ball_is_opp_goal"></block>'
+   '<block type="ball_is_opp_penalty"></block>'
+   '<block type="ball_is_opp_field"></block>'
+   '<block type="get_defense_kick_angle"></block>'
+   '<block type="get_attack_kick_angle"></block>'
+   '<block type="printconsole">'
+     '<mutation divisor_input="true"></mutation>'
+   '</block>'
+ '</category>'
+ '<sep></sep>'
+ '<category name="Logic" colour="#04862c">'
+   '<block type="controls_if"></block>'
+   '<block type="logic_compare"></block>'
+   '<block type="logic_operation"></block>'
+   '<block type="logic_negate"></block>'
+   '<block type="logic_boolean"></block>'
+   '<block type="logic_null" disabled="true"></block>'
+   '<block type="logic_ternary"></block>'
+ '</category>'
+ '<category name="Loops" colour="#0097bc">'
+   '<block type="controls_repeat_ext">'
+     '<value name="TIMES">'
+       '<shadow type="math_number">'
+         '<field name="NUM">10</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="controls_repeat" disabled="true"></block>'
+   '<block type="controls_whileUntil"></block>'
+   '<block type="controls_for">'
+     '<value name="FROM">'
+       '<shadow type="math_number">'
+         '<field name="NUM">1</field>'
+       '</shadow>'
+     '</value>'
+     '<value name="TO">'
+       '<shadow type="math_number">'
+         '<field name="NUM">10</field>'
+       '</shadow>'
+     '</value>'
+     '<value name="BY">'
+       '<shadow type="math_number">'
+         '<field name="NUM">1</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="controls_forEach"></block>'
+   '<block type="controls_flow_statements"></block>'
+ '</category>'
+ '<category name="Math" colour="#0052be">'
+   '<block type="math_number">'
+     '<field name="NUM">1</field>'
+   '</block>'
+   '<block type="math_arithmetic">'
+     '<value name="A">'
+       '<shadow type="math_number">'
+         '<field name="NUM">1</field>'
+       '</shadow>'
+     '</value>'
+     '<value name="B">'
+       '<shadow type="math_number">'
+         '<field name="NUM">1</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="math_single">'
+     '<value name="NUM">'
+       '<shadow type="math_number">'
+         '<field name="NUM">9</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="math_trig">'
+     '<value name="NUM">'
+       '<shadow type="math_number">'
+         '<field name="NUM">0</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="math_constant"></block>'
+   '<block type="math_number_property">'
+     '<value name="NUMBER_TO_CHECK">'
+       '<shadow type="math_number">'
+         '<field name="NUM">0</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="math_round">'
+     '<value name="NUM">'
+       '<shadow type="math_number">'
+         '<field name="NUM">3.1</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="math_on_list"></block>'
+   '<block type="math_modulo">'
+     '<value name="DIVIDEND">'
+       '<shadow type="math_number">'
+         '<field name="NUM">64</field>'
+       '</shadow>'
+     '</value>'
+     '<value name="DIVISOR">'
+       '<shadow type="math_number">'
+         '<field name="NUM">10</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="math_constrain">'
+     '<value name="VALUE">'
+       '<shadow type="math_number">'
+         '<field name="NUM">50</field>'
+       '</shadow>'
+     '</value>'
+     '<value name="LOW">'
+       '<shadow type="math_number">'
+         '<field name="NUM">1</field>'
+       '</shadow>'
+     '</value>'
+     '<value name="HIGH">'
+       '<shadow type="math_number">'
+         '<field name="NUM">100</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="math_random_int">'
+     '<value name="FROM">'
+       '<shadow type="math_number">'
+         '<field name="NUM">1</field>'
+       '</shadow>'
+     '</value>'
+     '<value name="TO">'
+       '<shadow type="math_number">'
+         '<field name="NUM">100</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="math_random_float"></block>'
+ '</category>'
+ '<category name="Lists" colour="#25286f">'
+   '<block type="lists_create_with">'
+     '<mutation items="0"></mutation>'
+   '</block>'
+   '<block type="lists_create_with"></block>'
+   '<block type="lists_repeat">'
+     '<value name="NUM">'
+       '<shadow type="math_number">'
+         '<field name="NUM">5</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="lists_length"></block>'
+   '<block type="lists_isEmpty"></block>'
+   '<block type="lists_indexOf">'
+     '<value name="VALUE">'
+       '<block type="variables_get">'
+         '<field name="VAR">list</field>'
+       '</block>'
+     '</value>'
+   '</block>'
+   '<block type="lists_getIndex">'
+     '<value name="VALUE">'
+       '<block type="variables_get">'
+         '<field name="VAR">list</field>'
+       '</block>'
+     '</value>'
+   '</block>'
+   '<block type="lists_setIndex">'
+     '<value name="LIST">'
+       '<block type="variables_get">'
+         '<field name="VAR">list</field>'
+       '</block>'
+     '</value>'
+   '</block>'
+   '<block type="lists_getSublist">'
+     '<value name="LIST">'
+       '<block type="variables_get">'
+         '<field name="VAR">list</field>'
+       '</block>'
+     '</value>'
+   '</block>'
+   '<block type="lists_split">'
+     '<value name="DELIM">'
+       '<shadow type="text">'
+         '<field name="TEXT">,</field>'
+       '</shadow>'
+     '</value>'
+   '</block>'
+   '<block type="lists_sort"></block>'
+   '<block type="lists_reverse"></block>'
+ '</category>'
+ '<sep></sep>'
+ '<category name="Variables" colour="#99138e" custom="VARIABLE"></category>'
+ '<category name="Functions" colour="#dd056a" custom="PROCEDURE"></category>'
+ '</xml>';
/* END BLOCKLY_TOOLBOX_XML ASSIGNMENT. DO NOT EDIT. */
