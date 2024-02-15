import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';

async function getProductInfo(url, region) {
    const browser = await launch();
    const page = await browser.newPage();
    
    try {
        // Переход на страницу товара
        await page.goto(url);

        // Ожидание появления блока с ценой товара
        await page.waitForSelector('.PriceInfo_root__GX9Xp');

        // Получение элемента с новой ценой товара
        const newPriceElement = await page.$('.PriceInfo_root__GX9Xp .Price_role_discount__l_tpE');

        let newPrice = null;
        // Проверка, был ли найден элемент с новой ценой
        if (newPriceElement) {
            // Получение текстового содержимого элемента с новой ценой товара
            newPrice = await page.evaluate(element => element.textContent.trim(), newPriceElement);
        }

        // Получение элемента с старой ценой товара
        const oldPriceElement = await page.$('.PriceInfo_root__GX9Xp .Price_role_old__r1uT1');

        let oldPrice = null;
        // Проверка, был ли найден элемент с старой ценой
        if (oldPriceElement) {
            // Получение текстового содержимого элемента с старой ценой товара
            oldPrice = await page.evaluate(element => element.textContent.trim(), oldPriceElement);
        }

        // Ожидание появления блока с рейтингом товара
        await page.waitForSelector('.ActionsRow_stars__EKt42');

        // Получение элемента с рейтингом товара
        const ratingElement = await page.$('.ActionsRow_stars__EKt42 .Rating_value__S2QNR');

        let rating = null;
        // Проверка, был ли найден элемент с рейтингом
        if (ratingElement) {
            // Получение текстового содержимого элемента с рейтингом товара
            rating = await page.evaluate(element => element.textContent.trim(), ratingElement);
        }

        // Ожидание появления блока с количеством отзывов
        await page.waitForSelector('.ActionsRow_reviews__AfSj_');

        // Получение элемента с количеством отзывов на товар
        const reviewCountElement = await page.$('.ActionsRow_reviews__AfSj_ button .ActionsRow_reviewsIcon__uzfME + span');

        let reviewCount = null;
        // Проверка, был ли найден элемент с количеством отзывов
        if (reviewCountElement) {
            // Получение текстового содержимого элемента с количеством отзывов на товар
            reviewCount = await page.evaluate(element => element.textContent.trim(), reviewCountElement);
        }

        // Сохранение данных о товаре в файл product.txt
        const productInfo = `price=${newPrice}\npriceOld=${oldPrice}\nrating=${rating}\nreviewCount=${reviewCount}`;
        writeFileSync('product.txt', productInfo);

        // Сохранение скриншота страницы товара
        await page.screenshot({ path: 'screenshot.jpg', fullPage: true });

        console.log('Данные о товаре успешно получены и сохранены в файле product.txt');
        console.log('Скриншот страницы товара успешно сохранен в файле screenshot.jpg');
    } catch (error) {
        console.error('Произошла ошибка:', error);
    } finally {
        // Закрытие браузера
        await browser.close();
    }
}

const url = process.argv[2];
const region = process.argv[3];

if (!url || !region) {
    console.error('Usage: node index.js <url> <region>');
    process.exit(1);
}

getProductInfo(url, region);
