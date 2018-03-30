var s = new maths.scope()

function _eval() {
    var expr = document.getElementById("input").value

    var e = s.eval(expr)

    document.getElementById("view").value += '\n' + e.value
}