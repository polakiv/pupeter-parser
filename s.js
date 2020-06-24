/* 	const result = await page.evaluate(() => {
	let data = []; // Создаём пустой массив для хранения данных
	let elements = document.querySelectorAll('.product_pod'); // Выбираем все товары
	
	for (var element of elements){ // Проходимся в цикле по каждому товару
	let title = element.childNodes[5].innerText; // Выбираем название
	let price = element.childNodes[7].children[0].innerText; // Выбираем цену
	
	data.push({title, price}); // Помещаем объект с данными в массив
	}
	
	return data; // Возвращаем массив  
}); */   

/* https://www.google.com/maps/search/%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B5%D1%82-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+%D0%BC%D0%BE%D1%81%D0%BA%D0%B2%D0%B0/@2.5044037,-4.1553148,2z/data=!3m1!4b1


#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div:nth-child(1)// блок 1 переход
#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div:nth-child(3)// блок 2 переход
#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div:nth-child(39) */

 // след next

const querystring = require('querystring');
const puppeteer = require('puppeteer');

let scrape = async () => {
	 const browser = await puppeteer.launch({
     headless: false,
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  }) 
  
 // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
	//	await page.blacklist({})
	const page = await browser.newPage();   
	
	await page.waitFor(3000);
	await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() === 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
	await page.goto('https://www.google.com/maps/search/furniture+store+near+Kyiv/@50.4661185,30.5071831,12z/data=!3m1!4b1', { waitUntil: 'domcontentloaded' });
    await page.waitFor(23000);
	//await page.setViewport({width: 1500, height: 700})
 	/*  let a = 1;
	while (a < 3) {
	await page.click('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div > div > div:nth-child(1) > div > button:nth-child(2)');// переход сразу же
	await page.waitFor(13000);
	a++;
	} */  
	let k = 1;
	while (k <= 1000) {
	console.log(k + '  ряд');
	let i = 1;
	while (i <= 39) { // выводит 0, затем 1, затем 2
	console.log(i + '  колонка');
	
		await page.waitFor(10000);
	 try{
		await page.click('#pane div div div div div div div:nth-child('+ i +') div div div div div h3 span'); // переходим на первый товар в ряде
		await page.waitFor(2000);
	 } catch{
		try{		
			await page.waitFor(20000); // если что-то пошло не так , ждем еще 20 сек и повторяем 
			await page.click('#pane div div div div div div div:nth-child('+ i +') div div div div div h3 span'); // еще разок
		 }catch{
	   // i = i + 2;
			await page.waitFor(20000);
			await page.click('#pane div div div div div div div:nth-child(1) div div div div div h3 span'); // возможно закончилась лента рядов раньше времени, потому просто кликаем на 1 товар
			await page.click('span.section-rating-term > span > button'); // то есть при неудаче переходим как категорию этого товара и дальше идем по списку
			 
			i = 1; // начинаем сверху
		}
	 }
		await page.waitFor(13000);
	
		
		//await page.screenshot({path: 'google.png'});
		let result = await page.evaluate(() => {
			
			
			let thispageurl = document.location.href;
			localStorage.setItem('savethispageurl', thispageurl);
			
			var regexp = /@([^&]+)/i;
			
			if (!!regexp.exec(document.location.href)) 
			var mpn = regexp.exec(document.location.href)[1];
			//let fd = e.get('target').geometry.getCoordinates() + ''
			var  fdlat = mpn.split(',')[0];
			var  fdlng = mpn.split(',')[1];
			var mpn = fdlat + ',' + fdlng;
			fdlat = parseInt(fdlat);
			fdlng = parseInt(fdlng); 
			var isbn = fdlat + fdlng;
			//  myCookie = getCookie("userTown12"); 
			let imga = '';
			if(document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-hero-header-image > div.section-hero-header-image-hero-container.collapsible-hero-image > button > img') != null){
				imga = document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-hero-header-image > div.section-hero-header-image-hero-container.collapsible-hero-image > button > img').getAttribute('src');
			}
			let title = '';
			if(document.querySelector('h1') != null){
				title = document.querySelector('h1').innerText;
				title = title.replace(/"([^"]*)"/g, '$1');
			}
			let category = '';
			if(document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-hero-header-title > div.section-hero-header-title-description > div.section-hero-header-title-description-container > div > div:nth-child(2) > span.section-rating-term > span:nth-child(1) > button') != null){
			  category = document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-hero-header-title > div.section-hero-header-title-description > div.section-hero-header-title-description-container > div > div:nth-child(2) > span.section-rating-term > span:nth-child(1) > button').innerText;
			}
			let adres = '';
			if(document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(10) > div > div.section-info-line') != null){
				adres = document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(10) > div > div.section-info-line').innerText;
			} 
			let adresfull = '';
			if(document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(9) > div > div.section-info-line') != null){
				adresfull = document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(9) > div > div.section-info-line').innerText;
			}  
			 
			
			let urlu = '';
			if(document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-info.section-info-hoverable.section-info-underline > div > div.section-info-line > span.section-info-text') != null){
				urlu = document.querySelector('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-info.section-info-hoverable.section-info-underline > div > div.section-info-line > span.section-info-text').innerText;
			}  
			let tel = '';
			if(document.querySelector('div.section-info-speak-numeral') != null){
				tel = document.querySelector('div.section-info-speak-numeral').innerText; 
			}  
			let star = '';
			if(document.querySelector('.section-star-display') != null){
				star = document.querySelector('.section-star-display').innerText;
			} 
			//console.log(star);
			let rev = '';
			
			try{
				await page.click('#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(35) > div > div.section-review-content > div:nth-child(3) > jsl > button';
				await page.waitFor(3000);	
			}
			if(document.querySelector('#pane > div > div > div > div > div:nth-child(35) > div > div.section-review-content > div.section-review-line.section-review-line-with-indent > div > div > a > div.section-review-title') != null){
				rev += '<div class=titl>'+document.querySelector('#pane > div > div > div > div > div:nth-child(35) > div > div.section-review-content > div.section-review-line.section-review-line-with-indent > div > div > a > div.section-review-title').innerText+'</div>';
			}
			if(document.querySelector('#pane > div > div > div > div > div:nth-child(35) > div > div.section-review-content > div > div.section-review-review-content') != null){
				rev += '<div class=texta>'+document.querySelector('#pane > div > div > div > div > div:nth-child(35) > div > div.section-review-content > div > div.section-review-review-content').innerText+'</div>';
			} 
			try{
				await page.click('#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(38) > div > div.section-review-content > div:nth-child(3) > jsl > button';
				await page.waitFor(3000);	
			}
			if(document.querySelector('#pane > div > div > div > div > div:nth-child(38) > div > div.section-review-content > div.section-review-line.section-review-line-with-indent > div > div > a > div.section-review-title') != null){
				rev += '<div class=titl>'+document.querySelector('#pane > div > div > div > div > div:nth-child(38) > div > div.section-review-content > div.section-review-line.section-review-line-with-indent > div > div > a > div.section-review-title').innerText+'</div>';
			}
			if(document.querySelector('#pane > div > div > div > div > div:nth-child(38) > div > div.section-review-content > div > div.section-review-review-content') != null){
				rev += '<div class=texta>'+document.querySelector('#pane > div > div > div > div > div:nth-child(38) > div > div.section-review-content > div > div.section-review-review-content').innerText+'</div>';
			} 
			try{
				await page.click('#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(41) > div > div.section-review-content > div:nth-child(3) > jsl > button';
				await page.waitFor(3000);	
			}
			if(document.querySelector('#pane > div > div > div > div > div:nth-child(41) > div > div.section-review-content > div.section-review-line.section-review-line-with-indent > div > div > a > div.section-review-title') != null){
				rev += '<div class=titl>'+document.querySelector('#pane > div > div > div > div > div:nth-child(41) > div > div.section-review-content > div.section-review-line.section-review-line-with-indent > div > div > a > div.section-review-title').innerText+'</div>';
			}
			if(document.querySelector('#pane > div > div > div > div > div:nth-child(41) > div > div.section-review-content > div > div.section-review-review-content') != null){
				rev += '<div class=texta>'+document.querySelector('#pane > div > div > div > div > div:nth-child(41) > div > div.section-review-content > div > div.section-review-review-content').innerText+'</div>';
			} 
			try{
				await page.click('#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(44) > div > div.section-review-content > div:nth-child(3) > jsl > button';
				await page.waitFor(3000);	
			}
			if(document.querySelector('#pane > div > div > div > div > div:nth-child(44) > div > div.section-review-content > div.section-review-line.section-review-line-with-indent > div > div > a > div.section-review-title') != null){
				rev += '<div class=titl>'+document.querySelector('#pane > div > div > div > div > div:nth-child(44) > div > div.section-review-content > div.section-review-line.section-review-line-with-indent > div > div > a > div.section-review-title').innerText+'</div>';
			}
			if(document.querySelector('#pane > div > div > div > div > div:nth-child(44) > div > div.section-review-content > div > div.section-review-review-content') != null){
				rev += '<div class=texta>'+document.querySelector('#pane > div > div > div > div > div:nth-child(44) > div > div.section-review-content > div > div.section-review-review-content').innerText+'</div>';
			}   
			
			//console.log(thispageurl);
			return {
				thispageurl,
				mpn,
				isbn,
				imga,
				title,
				category,
				adres,
				adresfull,
				urlu,
				tel,
				rev,
				star 
			}
		});   
		require('jsdom/lib/old-api').env("", function(err, window) {
			if (err) {
				console.error(err);
				return;
			}
			var $ = require("jquery")(window);
			$.ajax({
				method: "POST",
				url: "https://bigdatamicrodata.pp.ua/index.php?route=api/q",
				data:  result 
			})
			
		});
		// console.log(result);
		/* var numPool = [ 1, 2, 3, 4, 5 ],
		rand = numPool[Math.floor(Math.random() * numPool.length)]; 
		try{
			 
			}catch	{
			rand = rand -1;
			await page.click('#pane > div > div > div > div > div > div > div > button:nth-child('+ rand +') > div > img'); 
		} */
		try{
			await page.click('#pane > div > div.widget-pane-content.scrollable-y > div > div > button > span'); /// назад к результатам
		}catch{
			await page.click('.section-rating-term span button'); // то есть при неудаче переходим как категорию этого товара и дальше идем по списку
		}
		await page.waitFor(3000); 
		
		i = i + 2;
	} 
	try{
		await page.click('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div > div > div:nth-child(1) > div > button:nth-child(2)'); //cлед некст
		await page.waitFor(13000);
		}
	catch{
		await page.click('#pane > div > div > div > div > div > div > div:nth-child(5)> div > div > div > div > div > h3 > span');
		await page.waitFor(13000);
		await page.click('span.section-rating-term > span > button');
		
		await page.waitFor(13000);
		// в случае если список заканчивается , переходим на категорию 
		}
	
		k++;
	} 
	// Код для скрапинга
	// что-нибудь возвращаем
	  return result;
	//  browser.close();
	
	
};      
scrape().then((value) => {
    console.log('Получилось!'); // Получилось!
	//scrape();
});          