import Router from "express";

const router = Router();

router.route('/health').get((__, res) => {
    res.json({
        message: "Serving users data perfectly",
        status: 200
    })
})
router.route('/test/:id').post((req, __) => {
    const {id} = req.params;
    res.json({
        message: id
    })
})

export default router;