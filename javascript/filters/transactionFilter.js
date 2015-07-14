'use strict'

// skill.filter('transactionHistory', function() {
//   return function(input, user) {
//     if (!input || !input.length) {return;}
//     var filtered = [], temp;
//     for (var i = 0; i < input.length; i++) {
//       if (input[i].userOne === user) {
//         filtered.push(input[i]);
//       }
//       if (input[i].userTwo === user) {
//         temp = Object.create(input[i]);
//         input[i].userOne = temp.userTwo;
//         input[i].userTwo = temp.userOne;
//         input[i].skillOne = temp.skillTwo;
//         input[i].skillTwo = temp.skillOne;
//         filtered.push(input[i]);
//       }
//     }
//     return filtered;
//   }
// });
