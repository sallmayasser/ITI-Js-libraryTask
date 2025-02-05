export class Book {
  #name;
  #price;
  #author;
  #id;

  constructor(name, price, author) {
    this.#id = Date.now();
    this.#name = name;
    this.#price = price;
    this.#author = author;
  }
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get price() {
    return this.#price;
  }
  get author() {
    return this.#author;
  }

  set name(name) {
    this.#name = name;
  }
  set price(price) {
    this.#price = price;
  }
  set author(author) {
    this.#author = author;
  }
  toString() {
    console.log(
      `the book name is :${this.#name} , its price is :${
        this.#price
      } , its author is : ${this.#author}`
    );
  }
}
