export class Book {
  #name;
  #price;
  #author;

  constructor(name, price, author) {
    this.#name = name;
    this.#price = price;
    this.#author = author;
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
