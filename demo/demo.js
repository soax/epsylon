var s = new maths.scope()

function _eval() {
    var expr = document.getElementById("input").value

    var e = s.eval(expr)

    var expr_El = document.createElement("div");
    expr_El.className = "expression";
    expr.innerHTML = expr;
    document.getElementById("view").appendChild(expr_El)

    var res_El = document.createElement("div");
    res_El.className = "result";
    resr.innerHTML = e.value;
    document.getElementById("view").appendChild(resr_El)
}