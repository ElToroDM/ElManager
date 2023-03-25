# Original code by Hardmath123 from https://github.com/Hardmath123/nearley/
# Modified by Diego Fraga
# Started: march 3 2023

main -> _ "=" _ AS _ {% (d) => {return {type:'main', d:d, v:d[3].v}} %}
    |   _ "=" _ SC _ {% (d) => {return {type:'main', d:d, v:d[3].v}} %}

# We define each level of precedence as a nonterminal.

# Parentheses
P -> "(" _ AS _ ")" {% (d) => {return {type:'P', d:d, v:d[2].v}} %}
    | N             {% id %}

# Exponents
E -> P _ "^" _ E    {% (d) => {return {type:'E', d:d, v:Math.pow(d[0].v, d[4].v)}} %}
    | P             {% id %}

# Multiplication and division
MD -> MD _ "*" _ E  {% (d) => {return {type: 'M', d:d, v:d[0].v*d[4].v}} %}
    | MD _ "/" _ E  {% (d) => {return {type: 'D', d:d, v:d[0].v/d[4].v}} %}
    | E             {% id %}
# Addition and subtraction
AS -> AS _ "+" _ MD {% (d) => {return {type:'A', d:d, v:d[0].v+d[4].v}} %}
    | AS _ "-" _ MD {% (d) => {return {type:'S', d:d, v:d[0].v-d[4].v}} %}
    | MD            {% id %}

SP  -> "(" _ SC _ ")" {% (d) => {return {type:'SP', d:d, v:d[2].v}} %}
    | S             {% id %}

# String concatenation
SC -> SC _ "&" _ AS {% (d) => {return {type:'SC', d:d, v:d[0].v+d[4].v}} %}
    | SC _ "&" _ S  {% (d) => {return {type:'SC', d:d, v:d[0].v+d[4].v}} %}
    | AS _ "&" _ S  {% (d) => {return {type:'SC', d:d, v:d[0].v+d[4].v}} %}
    | SP             {% id %}

# A string or a function of a string
S -> string {% (d) => {return {v:d[0]}} %}
    #| "parentprop"i _ "(" _ SC _ ")" {% (d) => {return {type:'parentprop', d:d, v:parentProp(d[4].v)}}  %}
    #| "parentprop"i _ "(" _ SC _ ")" {% (d) => {return {type:'parentprop', d:d, v:d[4].v}}  %}

# A number or a function
N -> float  {% id %}
	#| prop {% (d) =>{return {type:'prop',  v:d[0]}} %}
	| prop {% (d) =>{return {type:'prop',  v:prop(d[0])}} %}
	#| prop {% (d) =>{return {type:'prop', d:d, v:10}}  %}
	 #| prop _ "|||" int {% (d) =>{return {type:'prop', d:d, v:d[3].v}}  %}
	 #| prop _ "|||" int {% (d) =>{return {type:'prop', d:d, v:prop(d[3].v,d[0].v)}}  %}
	#| ".." prop {% (d) =>{return {type:'parentprop', d:d, v:parentProp(d[1].v)}}  %}
	#| ".." prop {% (d) => {return { type:'parentprop', d:d, v:100}} %}

    | "sin"i _ "(" _ AS _ ")" {% (d) => {return {type:'sin', d:d, v:Math.sin(d[4].v)}} %}
    | "cos"i _ "(" _ AS _ ")" {% (d) => {return {type:'cos', d:d, v:Math.cos(d[4].v)}} %}
    | "tan"i _ "(" _ AS _ ")" {% (d) => {return {type:'tan', d:d, v:Math.tan(d[4].v)}} %}
    | "asin"i _ "(" _ AS _ ")" {% (d) => {return {type:'asin', d:d, v:Math.asin(d[4].v)}} %}
    | "acos"i _ "(" _ AS _ ")" {% (d) => {return {type:'acos', d:d, v:Math.acos(d[4].v)}} %}
    | "atan"i _ "(" _ AS _ ")" {% (d) => {return {type:'atan', d:d, v:Math.atan(d[4].v)}} %}
    | "sqrt"i _ "(" _ AS _ ")" {% (d) => {return {type:'sqrt', d:d, v:Math.sqrt(d[4].v)}} %}
    | "ln"i _ "(" _ AS _ ")" {% (d) => {return {type:'ln', d:d, v:Math.log(d[4].v)}} %}
    | "max"i _ "(" _ AS (_ "," _ AS):+ _ ")" {% (d) => {return {type:'max', d:d, v:Math.max(d[4].v,...d[5].map(item => item[3].v))}} %}
    | "min"i _ "(" _ AS (_ "," _ AS):+ _ ")" {% (d) => {return {type:'min', d:d, v:Math.min(d[4].v,...d[5].map(item => item[3].v))}} %}
    | "pi"i _ "(" _ ")" {% (d) => {return { v:Math.PI}} %}
    | "e"i _ "(" _ ")" {% (d) => {return { v:Math.E}} %}
    | "-" _ P      {% (d) => {return {type:'neg', d:d, v:-d[2].v}} %}
    | "+" _ P      {% (d) => {return {type:'pos', d:d, v:d[2].v}} %}

# Prop
prop -> [a-zA-Z_\\] [a-zA-Z0-9_.]:* {% (d) => d[0] + d[1].join("") %}

# Quoted string
string-> "\"" characters "\"" {% (d) => d[1] %}
string-> "'"  characters "'"  {% (d) => d[1] %}

characters -> [^\"]:+ {% (d) => d[0].join("") %}

# I use `float` to basically mean a number with a decimal point in it
float ->
      int "." int   {% (d) => {return {v:parseFloat(d[0].v + d[1] + d[2].v)}} %}
    | int           {% (d) => {return {v:parseInt(d[0].v)}} %}
    | int "."       {% (d) => {return {v:parseInt(d[0].v)}} %}
    | "." int       {% (d) => {return {v:parseFloat(d[0] + d[1].v)}} %}

int -> [0-9]:+      {% (d) => {return {v:d[0].join("")}} %}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*     {% (d) => null %}
