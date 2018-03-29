import {scope} from '../scope'

let s = new scope()

function _eval() {
    var expr = document.getElementById("input").textContent
    console.log(expr)

    console.log(s.eval(expr).value)
}