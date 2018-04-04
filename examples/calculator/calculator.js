var s = new maths.scope()

function _eval() {
    var expr = document.getElementById("input").value

    var e = s.eval(expr)

    var b_El = document.createElement("div");

    var expr_El = document.createElement("div");
    expr_El.className = "expression";
    expr_El.innerHTML = '$' + expr + '$';
    b_El.appendChild(expr_El)


    var value = ''
    if (e.is_assignment) {
        value = '$ \\rightarrow ' + e.name + '$'
    } else {
        value = '$' + e.value + '$'
    }
    var res_El = document.createElement("div");
    res_El.className = "result";
    res_El.innerHTML = value
    b_El.appendChild(res_El)


    document.getElementById("view").appendChild(b_El)

    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"view"]);
}