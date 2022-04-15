module.exports = (req, res, next) => {
	res.layout = (partial_file, data, callback) => {
		let layout = 'layout'
		res.render(partial_file, data, (err, html) => {
			if (err) throw err

			data['yield'] = html
			if (data.hasOwnProperty('layout')) {
				layout = data.layout
				delete data.layout
			}

			if (callback == undefined) {
				res.render(layout, data)
			} else {
				res.render(layout, data, callback)	
			}
		})
	}
	
	next()
}