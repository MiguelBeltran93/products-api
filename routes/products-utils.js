const URL = "https://api.mercadolibre.com";

/**
 *
 * @param currency
 * @returns {any | string}
 */
const getCurrency = (currency)=> {
    const currencyData = JSON.parse(currency);
    return currencyData && currencyData.currency_id || '';
};
/**
 *
 * @param currency
 * @returns {any | string}
 */
const getCurrencyByList = (currency)=> {
    const currencyData = JSON.parse(currency);
    return currencyData.results && currencyData.results.length>0 && currencyData.results[0].currency_id || '';
};
/**
 *
 * @param data
 * @returns {[]}
 */
const buildCategories = (data) => {
    let resultCategory = [];
    data && data.values[0] && data.values[0].path_from_root && data.values[0].path_from_root.map((element) => {
        resultCategory.push(element.name);
    });

    return resultCategory;
};
/**
 *
 * @param value
 * @returns {*}
 */
const validateValue = (value) => {
    return value ? value : '';
};
/**
 *
 * @param inputPicture
 * @returns {*|*[]|string}
 */
const validatePicture = (inputPicture) => {
    const picture = inputPicture && inputPicture[0] || [];

    return picture && picture.secure_url || '';
};
/**
 *
 * @param shipping
 * @returns {*|*[]|boolean}
 */
const validateFreeShipping = (shipping) => {
    const resultShipping = shipping && shipping.free_methods && shipping.free_methods[0] || [];

    return resultShipping && resultShipping.rule && resultShipping.rule.free_shipping_flag || false;
};
/**
 *
 * @param inputPrice
 * @returns {{price: number, decimals: string}|{price: string, decimals: string | string}}
 */
const getPrice = (inputPrice) => {
    if (!inputPrice) {
        return {price: 0, decimals: ''}
    }
    const price = inputPrice.toString().split('.');
    const decimalsAmount = price.length > 1 ? price[1] : '';

    return {price: price[0], decimals: decimalsAmount}
};
/**
 *
 * @param itemList
 * @returns {[]}
 */
const buildListItems = (itemList, currency) => {
    let list = [];
    itemList.map((element) => {
        const {price, decimals} = getPrice(element.price.toString());
        const itemValue = {
            id: validateValue(element.id),
            title: validateValue(element.title),
            price: {currency: validateValue(currency.symbol), amount: price, decimals: decimals},
            picture: validateValue(element.thumbnail),
            condition: validateValue(element.condition),
            free_shipping: validateValue(element.shipping.free_shipping)
        };
        list.push(itemValue);
    });

    return list;
};
/**
 *
 * @param data
 * @param currency
 * @returns {{author: {lastName: string, name: string}, categories: *[], items: *[]}}
 */
const buildResponseList = (data, currency) => {
    const resultItems = JSON.parse(data);
    const currencyData = JSON.parse(currency);
    const items = [];
    const MAX_PRODUCTS = 4;
    for (let i = 0; i < (resultItems.results.length < MAX_PRODUCTS ? resultItems.results.length : MAX_PRODUCTS); i++) {
        //todo items al azar
        resultItems.results.length > 0 && items.push(resultItems.results[i]);
    }
    return {
        "author": {"name": "Miguel", "lastName": "Beltran"},
        "categories": buildCategories(resultItems.filters[0]),
        "items": buildListItems(items, currencyData)
    };
};
/**
 *
 * @param detail
 * @param description
 * @param currency
 * @returns {{item: {condition: *, free_shipping: (*|*[]|boolean), price: {amount: *, decimals: string, currency: *}, description: *, id: *, title: *, sold_quantity: *, picture: (*|*[]|string)}, author: {lastName: string, name: string}}}
 */
const buildDetail = (detail, description, currency) => {
    const resultDetailItem = JSON.parse(detail);
    const resultDescriptionItem = JSON.parse(description);
    const currencyData = JSON.parse(currency);
    const {price, decimals} = getPrice(resultDetailItem.price);

    return {
        "author": {"name": "Miguel", "lastName": "Beltran"},
        "item": {
            "id": validateValue(resultDetailItem.id),
            "title": validateValue(resultDetailItem.title),
            "price": {
                "currency": validateValue(currencyData.symbol),
                "amount": price,
                "decimals": decimals,
            },
            "picture": validatePicture(resultDetailItem.pictures),
            "condition": validateValue(resultDetailItem.condition),
            "free_shipping": validateFreeShipping(resultDetailItem.shipping),
            "sold_quantity": validateValue(resultDetailItem.sold_quantity),
            "description": validateValue(resultDescriptionItem.plain_text)
        }
    };
};

module.exports = {buildResponseList, buildDetail, getCurrencyByList, getCurrency, URL};