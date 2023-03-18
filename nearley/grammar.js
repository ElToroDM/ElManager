// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["_", {"literal":"="}, "_", "SC", "_"], "postprocess": function(d) {return {type:'main', d:d, v:d[3].v}}},
    {"name": "P", "symbols": [{"literal":"("}, "_", "SC", "_", {"literal":")"}], "postprocess": function(d) {return {type:'P', d:d, v:d[2].v}}},
    {"name": "P", "symbols": ["N"], "postprocess": id},
    {"name": "P", "symbols": ["S"], "postprocess": id},
    {"name": "E", "symbols": ["P", "_", {"literal":"^"}, "_", "E"], "postprocess": function(d) {return {type:'E', d:d, v:Math.pow(d[0].v, d[4].v)}}},
    {"name": "E", "symbols": ["P"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"*"}, "_", "E"], "postprocess": function(d) {return {type: 'M', d:d, v:d[0].v*d[4].v}}},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"/"}, "_", "E"], "postprocess": function(d) {return {type: 'D', d:d, v:d[0].v/d[4].v}}},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "MD"], "postprocess": function(d) {return {type:'A', d:d, v:d[0].v+d[4].v}}},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "MD"], "postprocess": function(d) {return {type:'S', d:d, v:d[0].v-d[4].v}}},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "SC", "symbols": ["SC", "_", {"literal":"&"}, "_", "AS"], "postprocess": function(d) {return {type:'SC', d:d, v:d[0].v+d[4].v}}},
    {"name": "SC", "symbols": ["AS"], "postprocess": id},
    {"name": "S", "symbols": ["string"], "postprocess": (d) => {return {v:d[0]}}},
    {"name": "S$subexpression$1", "symbols": [/[pP]/, /[aA]/, /[rR]/, /[eE]/, /[nN]/, /[tT]/, /[pP]/, /[rR]/, /[oO]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "S", "symbols": ["S$subexpression$1", "_", {"literal":"("}, "_", "SC", "_", {"literal":")"}], "postprocess": function(d) {return {type:'parentprop', d:d, v:parentProp(d[4].v)}}},
    {"name": "N", "symbols": ["float"], "postprocess": id},
    {"name": "N$subexpression$1", "symbols": [/[sS]/, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$1", "_", {"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return {type:'sin', d:d, v:Math.sin(d[4].v)}}},
    {"name": "N$subexpression$2", "symbols": [/[cC]/, /[oO]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$2", "_", {"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return {type:'cos', d:d, v:Math.cos(d[4].v)}}},
    {"name": "N$subexpression$3", "symbols": [/[tT]/, /[aA]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$3", "_", {"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return {type:'tan', d:d, v:Math.tan(d[4].v)}}},
    {"name": "N$subexpression$4", "symbols": [/[aA]/, /[sS]/, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$4", "_", {"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return {type:'asin', d:d, v:Math.asin(d[4].v)}}},
    {"name": "N$subexpression$5", "symbols": [/[aA]/, /[cC]/, /[oO]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$5", "_", {"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return {type:'acos', d:d, v:Math.acos(d[4].v)}}},
    {"name": "N$subexpression$6", "symbols": [/[aA]/, /[tT]/, /[aA]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$6", "_", {"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return {type:'atan', d:d, v:Math.atan(d[4].v)}}},
    {"name": "N$subexpression$7", "symbols": [/[sS]/, /[qQ]/, /[rR]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$7", "_", {"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return {type:'sqrt', d:d, v:Math.sqrt(d[4].v)}}},
    {"name": "N$subexpression$8", "symbols": [/[lL]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$8", "_", {"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return {type:'ln', d:d, v:Math.log(d[4].v)}}},
    {"name": "N$subexpression$9", "symbols": [/[mM]/, /[aA]/, /[xX]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "AS"]},
    {"name": "N$ebnf$1", "symbols": ["N$ebnf$1$subexpression$1"]},
    {"name": "N$ebnf$1$subexpression$2", "symbols": ["_", {"literal":","}, "_", "AS"]},
    {"name": "N$ebnf$1", "symbols": ["N$ebnf$1", "N$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N", "symbols": ["N$subexpression$9", "_", {"literal":"("}, "_", "AS", "N$ebnf$1", "_", {"literal":")"}], "postprocess": (d) => {return {type:'max', d:d, v:Math.max(d[4].v,...d[5].map(item => item[3].v))}}},
    {"name": "N$subexpression$10", "symbols": [/[mM]/, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}, "_", "AS"]},
    {"name": "N$ebnf$2", "symbols": ["N$ebnf$2$subexpression$1"]},
    {"name": "N$ebnf$2$subexpression$2", "symbols": ["_", {"literal":","}, "_", "AS"]},
    {"name": "N$ebnf$2", "symbols": ["N$ebnf$2", "N$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N", "symbols": ["N$subexpression$10", "_", {"literal":"("}, "_", "AS", "N$ebnf$2", "_", {"literal":")"}], "postprocess": (d) => {return {type:'min', d:d, v:Math.min(d[4].v,...d[5].map(item => item[3].v))}}},
    {"name": "N$subexpression$11", "symbols": [/[pP]/, /[iI]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$11", "_", {"literal":"("}, "_", {"literal":")"}], "postprocess": (d) => {return { v:Math.PI}}},
    {"name": "N$subexpression$12", "symbols": [/[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "N", "symbols": ["N$subexpression$12", "_", {"literal":"("}, "_", {"literal":")"}], "postprocess": (d) => {return { v:Math.E}}},
    {"name": "N", "symbols": [{"literal":"-"}, "_", "P"], "postprocess": (d) => {return {type:'neg', d:d, v:-d[2].v}}},
    {"name": "N", "symbols": [{"literal":"+"}, "_", "P"], "postprocess": (d) => {return {type:'pos', d:d, v:d[2].v}}},
    {"name": "string", "symbols": [{"literal":"\""}, "characters", {"literal":"\""}], "postprocess": (d) => d[1]},
    {"name": "string", "symbols": [{"literal":"'"}, "characters", {"literal":"'"}], "postprocess": (d) => d[1]},
    {"name": "characters", "symbols": ["character"], "postprocess": id},
    {"name": "characters", "symbols": ["character", "characters"], "postprocess": (d) => d[0] + d[1]},
    {"name": "character", "symbols": [/[^\"]/], "postprocess": id},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": function(d) {return {v:parseFloat(d[0].v + d[1] + d[2].v)}}},
    {"name": "float", "symbols": ["int"], "postprocess": function(d) {return {v:parseInt(d[0].v)}}},
    {"name": "float", "symbols": ["int", {"literal":"."}], "postprocess": function(d) {return {v:parseInt(d[0].v)}}},
    {"name": "float", "symbols": [{"literal":"."}, "int"], "postprocess": function(d) {return {v:parseFloat(d[0] + d[1].v)}}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return {v:d[0].join("")}}},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null }}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
