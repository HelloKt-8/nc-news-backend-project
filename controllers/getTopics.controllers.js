const {selectTopics} = require('../models/selectTopics.models')

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        //console.log({topics})
        res.status(200).send({topics})
    }).catch (err => {next(error)})
}