/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

/**
 * GlobalProtoID enum.
 * @exports GlobalProtoID
 * @enum {string}
 * @property {number} REQ_PLAYER_RANKLIST=100001 REQ_PLAYER_RANKLIST value
 * @property {number} RSP_PLAYER_RANKLIST=100002 RSP_PLAYER_RANKLIST value
 * @property {number} REQ_UPDATE_PLAYER_MAX_SCORE=100003 REQ_UPDATE_PLAYER_MAX_SCORE value
 * @property {number} REQ_GET_PLAYER_MAX_SCORE=100004 REQ_GET_PLAYER_MAX_SCORE value
 * @property {number} RSP_GET_PLAYER_MAX_SCORE=100005 RSP_GET_PLAYER_MAX_SCORE value
 * @property {number} REQ_GET_RESURRECTION_COIN_NUM=100006 REQ_GET_RESURRECTION_COIN_NUM value
 * @property {number} RSP_GET_RESURRECTION_COIN_NUM=100007 RSP_GET_RESURRECTION_COIN_NUM value
 * @property {number} REQ_ACCEPTED_INVITATION=100008 REQ_ACCEPTED_INVITATION value
 * @property {number} RSP_ACCEPTED_INVITATION=100009 RSP_ACCEPTED_INVITATION value
 * @property {number} REQ_SHARE_LINK=100010 REQ_SHARE_LINK value
 * @property {number} RSP_SHARE_LINK=100011 RSP_SHARE_LINK value
 * @property {number} INFO_LOGIN_REWARD=100012 INFO_LOGIN_REWARD value
 * @property {number} REQ_COST_RESURRECTION_COIN=100013 REQ_COST_RESURRECTION_COIN value
 * @property {number} RSP_COST_RESURRECTION_COIN=100014 RSP_COST_RESURRECTION_COIN value
 * @property {number} REQ_GET_GOLD_COIN_NUM=100015 REQ_GET_GOLD_COIN_NUM value
 * @property {number} RSP_GET_GOLD_COIN_NUM=100016 RSP_GET_GOLD_COIN_NUM value
 * @property {number} REQ_COST_GOLD_COIN=100017 REQ_COST_GOLD_COIN value
 * @property {number} RSP_COST_GOLD_COIN=100018 RSP_COST_GOLD_COIN value
 * @property {number} REQ_ADD_GOLD_COIN=100019 REQ_ADD_GOLD_COIN value
 * @property {number} RSP_ADD_GOLD_COIN=100020 RSP_ADD_GOLD_COIN value
 * @property {number} REQ_GET_BALL_LIST=100021 REQ_GET_BALL_LIST value
 * @property {number} RSP_GET_BALL_LIST=100022 RSP_GET_BALL_LIST value
 * @property {number} REQ_GET_CURRENT_BALL_ID=100023 REQ_GET_CURRENT_BALL_ID value
 * @property {number} RSP_GET_CURRENT_BALL_ID=100024 RSP_GET_CURRENT_BALL_ID value
 * @property {number} REQ_BUY_BALL_ID=100025 REQ_BUY_BALL_ID value
 * @property {number} RSP_BUY_BALL_ID=100026 RSP_BUY_BALL_ID value
 * @property {number} REQ_CHOOSE_BALL_ID=100027 REQ_CHOOSE_BALL_ID value
 * @property {number} RSP_CHOOSE_BALL_ID=100028 RSP_CHOOSE_BALL_ID value
 * @property {number} REQ_SHARE_COIN_AND_BALL=100029 REQ_SHARE_COIN_AND_BALL value
 * @property {number} RSP_SHARE_COIN_AND_BALL=100030 RSP_SHARE_COIN_AND_BALL value
 */
$root.GlobalProtoID = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[100001] = "REQ_PLAYER_RANKLIST"] = 100001;
    values[valuesById[100002] = "RSP_PLAYER_RANKLIST"] = 100002;
    values[valuesById[100003] = "REQ_UPDATE_PLAYER_MAX_SCORE"] = 100003;
    values[valuesById[100004] = "REQ_GET_PLAYER_MAX_SCORE"] = 100004;
    values[valuesById[100005] = "RSP_GET_PLAYER_MAX_SCORE"] = 100005;
    values[valuesById[100006] = "REQ_GET_RESURRECTION_COIN_NUM"] = 100006;
    values[valuesById[100007] = "RSP_GET_RESURRECTION_COIN_NUM"] = 100007;
    values[valuesById[100008] = "REQ_ACCEPTED_INVITATION"] = 100008;
    values[valuesById[100009] = "RSP_ACCEPTED_INVITATION"] = 100009;
    values[valuesById[100010] = "REQ_SHARE_LINK"] = 100010;
    values[valuesById[100011] = "RSP_SHARE_LINK"] = 100011;
    values[valuesById[100012] = "INFO_LOGIN_REWARD"] = 100012;
    values[valuesById[100013] = "REQ_COST_RESURRECTION_COIN"] = 100013;
    values[valuesById[100014] = "RSP_COST_RESURRECTION_COIN"] = 100014;
    values[valuesById[100015] = "REQ_GET_GOLD_COIN_NUM"] = 100015;
    values[valuesById[100016] = "RSP_GET_GOLD_COIN_NUM"] = 100016;
    values[valuesById[100017] = "REQ_COST_GOLD_COIN"] = 100017;
    values[valuesById[100018] = "RSP_COST_GOLD_COIN"] = 100018;
    values[valuesById[100019] = "REQ_ADD_GOLD_COIN"] = 100019;
    values[valuesById[100020] = "RSP_ADD_GOLD_COIN"] = 100020;
    values[valuesById[100021] = "REQ_GET_BALL_LIST"] = 100021;
    values[valuesById[100022] = "RSP_GET_BALL_LIST"] = 100022;
    values[valuesById[100023] = "REQ_GET_CURRENT_BALL_ID"] = 100023;
    values[valuesById[100024] = "RSP_GET_CURRENT_BALL_ID"] = 100024;
    values[valuesById[100025] = "REQ_BUY_BALL_ID"] = 100025;
    values[valuesById[100026] = "RSP_BUY_BALL_ID"] = 100026;
    values[valuesById[100027] = "REQ_CHOOSE_BALL_ID"] = 100027;
    values[valuesById[100028] = "RSP_CHOOSE_BALL_ID"] = 100028;
    values[valuesById[100029] = "REQ_SHARE_COIN_AND_BALL"] = 100029;
    values[valuesById[100030] = "RSP_SHARE_COIN_AND_BALL"] = 100030;
    return values;
})();

/**
 * GameProtoID enum.
 * @exports GameProtoID
 * @enum {string}
 * @property {number} XXX=1 XXX value
 */
$root.GameProtoID = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[1] = "XXX"] = 1;
    return values;
})();

export { $root as default };
