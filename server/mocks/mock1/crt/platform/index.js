module.exports = {
    definition: {
        description: 'CRT Platform',
        module_prefix: 'platform',
        url_prefix: '/platform',

        requests: [{
            uri: '/platform/action-log',
            title: 'Post Action Log',
            method: 'POST',
            body: [{
              name: 'application',
              type: 'string',
              description: '',
              notes: 'ex: readmissions',
              required: true
            },{
              name: 'action',
              type: 'string',
              description: '',
              notes: 'ex: census-print',
              required: true
            }],
            responses: [{
                type: 'JSON',
                description: '',
                examples: [{
                    title: 'Success',
                    conditional: 'default',
                    json: require('./fixtures/post_action_log').success
                }]
            }],
            notes: [{
              title: 'Action Log',
              author: 'Jordan',
              when: 'Sept 6',
              note: 'This should simply log that the user has committed some action and the timestamp at which they did it.'
            }]
        },
        {
          uri: '/platform/action-log',
          title: 'Get Action Log',
          method: 'GET',
          body: [{
            name: 'start_date',
            type: 'string',
            description: 'yyyy/mm/dd',
            notes: '',
            required: true
          },{
            name: 'end_date',
            type: 'string',
            description: 'yyyy/mm/dd',
            notes: '',
            required: true
          }],
          responses: [{
                type: 'JSON',
                description: '',
                examples: [{
                    title: 'Success',
                    conditional: 'default',
                    json: require('./fixtures/get_action_log').success
                }]
            }],
        }]
    }
};