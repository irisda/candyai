module.exports = {
    extends: ['@commitlint/config-conventional'],
    ignores: [ 
        (message) => message.includes('tes:fix commit issue'),
        (message) => message.includes('test:update customer adding settlement account'),
        (message) => message.includes('test:update customer before'),
        (message) => message.includes('Add new test case for intervalfrequecy'),
        (message) => message.includes('input: fix commit issue'),
       
        
        
    ],

}
