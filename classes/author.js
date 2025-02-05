export class Author {
  #name;
  #email;
  constructor(name, email) {
    this.#name = name;
    this.#email = email;
  }
  get name() {
    return this.#name;
  }
  get email() {
    return this.#email;
  }

  set name(name) {
    this.#name = name;
  }
  set email(email) {
    this.#email = email;
  }
  toString() {
    console.log(
      `the author name is :${this.#name} , author email is : ${this.#email}`
    );
  }
}
