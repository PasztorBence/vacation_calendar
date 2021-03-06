const express = require('express');
const router = express.Router();
const passport = require('passport');

//Load validations
const validateUnallowedDateInput = require('../../validators/datePairValidation');

//Load models
const UnallowedDate = require('../../models/unallowedDates');

//@route        POST api/unallow/admin/
//@description  Az admin megad egy tiltott időintervallumot
//@access       Private
router.post('/admin',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
    //const {errors, isValid} = validateUnallowedDateInput(req.body);
        //Check validation

            const newUnallow = new UnallowedDate({
                start_date: req.body.start_date,
                description: req.body.description
            });
            newUnallow
                .save()
                .then(unallow => res.json(unallow))
                .catch(err => console.log(err));

    }
);

//@route        GET api/unallow/admin
//@description  Lekér minden tiltott dátumot
//@access       Private
router.get('/admin',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        UnallowedDate
            .find()
            .sort({start_date: -1})
            .then(dates => res.json(dates))
            .catch(err => res.status(404).json({nodatesfound: 'No dates found'})
            )
    }
);

//@route        PUT api/unallow/admin/:id
//@description  Az admin módosít egy tiltott időintervallumot
//@access       Private
router.put('/admin/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const {errors, isValid} = validateUnallowedDateInput(req.body);
        if (!isValid) {
            //return any errors with 400 status
            return res.status(400).json(errors);
        } else {
            const unallowedFields = {};

            unallowedFields.start_date = req.body.start_date;
            unallowedFields.end_date = req.body.end_date;
            unallowedFields.description = req.body.description;

            UnallowedDate
                .findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: unallowedFields},
                    {new: true}
                )
                .then(unallowing => res.json(unallowing))
                .catch(err => res.json(err))
        }
    }
);

//@route        DELETE api/unallow/admin/:id
//@description  Az admin töröl egy tiltott időintervallumot
//@access       Private
router.delete('/admin/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        UnallowedDate
            .deleteOne({_id: req.params.id})
            .then(UnallowedDate
                .find()
                .sort({start_date: -1})
                .then(dates => res.json(dates))
                .catch(err => res.status(404).json({nodatesfound: 'No dates found'})
                ))
            .catch(err => res.status(404).json({norequestfound: 'No unallowed date found with that id'}))
    }
);

module.exports = router;