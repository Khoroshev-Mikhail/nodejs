function User(name, age){
    this.name = name;
    this.age = age;

    this.sayHi = () => {
        console.log(this.name + ' ' + this.age)
    }
}

module.exports = User