import { money } from "../data/index.js";

export default function MarketCard({
  image,
  category,
  price,
  unit,
  logo,
  supplier,
  text,
  buttonText = "ADD TO ORDER",
  onBuy,
}) {
  return (
    <div className="marketplace-card">
      <img className="marketplace-card__image" src={image} alt={supplier} />
      <div className="marketplace-card__body">
        <div className="marketplace-card__top">
          <span className="marketplace-card__category">{category}</span>
          <span className="marketplace-card__price">
            {money(price)}
            {unit ? <small> / {unit}</small> : null}
          </span>
        </div>
        <div className="marketplace-card__brand">
          <img src={logo} alt="" />
          <h3>{supplier}</h3>
        </div>
        <p className="marketplace-card__description">{text}</p>
        <button
          className="marketplace-card__button"
          type="button"
          onClick={onBuy}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
