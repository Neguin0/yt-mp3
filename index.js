const axios = require('axios');
const cheerio = require('cheerio');
const app = require('express')();
const port = process.env.PORT || 3000
app.listen(port, function(){
	console.log('Server Online em: http://localhost:'+port);
});
const { searchVideo } = require('usetube');

app.get('/:q', async function (req, res) {
	res.send('YouTube get link mp3 download')
})

app.get('/:q', async function (req, res) {
	const q = await searchVideo(req.params.q);
	const audio = await audioY2Dl("https://youtu.be/"+q.videos[0].id);
	res.send(audio[0].link);
})

async function audioY2Dl(baseUrl) {
	const result = [];
	try {
		await axios({
			method: 'get',
			url: `https://y2convert.net/file/all/${yotubeUrlId(baseUrl)}`
		}).then(async (response) => {
			const $ = await cheerio.load(response.data);
			const Elements = await $('#tab-mp3 > table > tbody > tr').each(async function (is, Elements) {
				const tdElenents = $(this).find('td');
				await result.push({
					qualidade: $(tdElenents[0]).text(),
					tamanho: $(tdElenents[1]).text(),
					link: $(this).find('td').find('a').attr('href')
				});
			});
		});
		return result
	} catch (error) {
		console.log(error)
	};
};

async function otherY2Dl(baseUrl) {
	const result = [];
	try {
		await axios({
			method: 'get',
			url: `https://y2convert.net/file/all/${yotubeUrlId(baseUrl)}`
		}).then(async (response) => {
			const $ = await cheerio.load(response.data);
			const Elements = await $('#tab-mkv > table > tbody > tr').each(async function (is, Elements) {
				const tdElenents = $(this).find('td');
				await result.push({
					qualidade: $(tdElenents[0]).text().split("\n")[0],
					tamanho: $(tdElenents[1]).text(),
					link: $(this).find('td').find('a').attr('href')
				});
			});
		});
		return result
	} catch (error) {
		console.log(error)
	};
};

async function videoY2Dl(baseUrl) {
	const result = [];
	try {
		await axios({
			method: 'get',
			url: `https://y2convert.net/file/all/${yotubeUrlId(baseUrl)}`
		}).then(async (response) => {
			const $ = await cheerio.load(response.data);
			const Elements = await $('#tab-mp4 > table > tbody > tr').each(async function (is, Elements) {
				const tdElenents = $(this).find('td');
				await result.push({
					qualidade: $(tdElenents[0]).text().split("\n")[0],
					tamanho: $(tdElenents[1]).text(),
					link: $(this).find('td').find('a').attr('href')
				});
			});
		});
		return result
	} catch (error) {
		console.log(error)
	};
};

function yotubeUrlId(url) {
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	var match = url.match(regExp);
	return (match && match[7].length == 11) ? match[7] : false;
};