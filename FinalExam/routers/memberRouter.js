const express = require('express');
const { memberController } = require('../controllers');

const router = express.Router();

router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMemberById);
router.get('/search', memberController.getMemberByParams);


router.post('/',
    memberController.validateCreateRequest,
    memberController.insertMember
);

router.put('/',
    memberController.validateUpdateRequest,
    memberController.updateMember
);

router.delete('/:id', memberController.deleteMember);

module.exports = router;
