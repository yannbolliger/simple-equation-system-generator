
const randomInt = (min = -15, max = 15) => {
  let r = 0
  while (r === 0) r = Math.round(Math.random()*(max - min)) +  min
  return r
}

const gcd = (a, b) => (!b) ? a : gcd(b, a % b)

class Rational {
  constructor(num, denom = 1) {
    this.num = num
    this.denom = denom
  }

  multiply(other) {
    return new Rational(this.num * other.num, this.denom * other.denom).simplify()
  }

  add(other) {
    const num = this.num * other.denom + other.num * this.denom
    return new Rational(num, this.denom * other.denom).simplify()
  }

  simplify() {
    const gcdNum = gcd(this.num, this.denom)
    return new Rational(this.num/gcdNum, this.denom/gcdNum)
  }

  toString() {
    const r = this.simplify()
    const sign = (r.num < 0 || r.denom < 0) ? "-" : ""
    const num = Math.abs(r.num)
    const denom = (r.denom !== 1) ? "/" + Math.abs(r.denom) : ""

    return sign + num + denom
  }
}

function randomRational(denom) {
  return new Rational(randomInt(), denom || randomInt())
}

class EquationSide {
  constructor(x = new Rational(0), y = new Rational(0), c = new Rational(0)) {
    this.x = x
    this.y = y
    this.c = c
  }

  add(other) {
    return new EquationSide(
      this.x.add(other.x),
      this.y.add(other.y),
      this.c.add(other.c)
    )
  }

  multiply(factor) {
    return new EquationSide(
      this.x.multiply(factor),
      this.y.multiply(factor),
      this.c.multiply(factor)
    )
  }

  toVariableString(variable, variableName) {
    if (variable.num === 0) return ""
    else if (variable.num === 1 && variable.denom === 1) return variableName
    else return variable.toString() + variableName.toString()
  }

  invert() {
    return this.multiply(new Rational(-1))
  }

  toString() {
    if (this.x.num === 0 && this.y.num === 0 && this.c.num === 0) return "0"

    const x = this.toVariableString(this.x, "x")
    const y = this.toVariableString(this.y, "y")
    const c = (this.c.num === 0) ? "" : this.c.toString()

    return [x,y,c].filter(s => s.length > 0).join(" + ")
  }
}

const randomSide = () =>
  new EquationSide(randomRational(1), randomRational(1), randomRational(1))

class Equation {
  constructor(lhs, rhs) {
    this.lhs = lhs
    this.rhs = rhs
  }

  add(other) {
    return new Equation(this.lhs.add(other.lhs), this.rhs.add(other.rhs))
  }

  multiply(factor) {
    return new Equation(this.lhs.multiply(factor), this.rhs.multiply(factor))
  }

  toString() {
    return this.lhs + " = " + this.rhs
  }
}

const randomVector = () => [randomRational(), randomRational()]


const solvedSystem = (solution) => [
  new Equation(
    new EquationSide(new Rational(1)),
    new EquationSide(new Rational(0), new Rational(0), solution[0])
  ),
  new Equation(
    new EquationSide(new Rational(0), new Rational(1)),
    new EquationSide(new Rational(0), new Rational(0), solution[1])
  )
]

const transform = (system, _) => {
  const rand = randomInt(0, 11)
  const l = rand % 2
  const r = (rand + 1) % 2

  switch (rand) {
    
    case 0:
      return [system[l].multiply(randomRational()), system[r]]

    case 1:
    case 2:
    case 3:
      return [system[l].multiply(randomRational(1)), system[r]]

    case 3:
    case 4:
    case 5:
    case 6:
      return [system[l], system[r].add(system[l])]

    default:
      const rSide = randomSide()
      const lhs = system[l].lhs.add(rSide)
      const rhs = system[l].rhs.add(rSide.invert())

      return [new Equation(lhs, rhs), system[r]]
  }
}

const transformedSystem = (solution, difficulty) => {
  return new Array(difficulty).fill(1).reduce(transform, solvedSystem(solution))
}
