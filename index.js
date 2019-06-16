const _ = require('lodash');
const data = require('./data');
const Elo = require('@pelevesque/elo');

const elo = new Elo();
const raceResults = _.map(data, (race) => {
  const results = race.results;
  let worstTime = -1;
  return _.map(results, (result) => {
    let time;
    if (result.time < 0) {
      time = worstTime + 600;
    } else {
      time = result.time;
      worstTime = time;
    }
    return {
      runner: result.player,
      time
    };
  });
});
const ratings = {};

const setDefaultRatings = (runners) => {
  _.forEach(runners, (runner) => {
    ratings[runner] = 1000;
  });
};

const scoreFromMargin = (margin) => 1 / (1 + Math.exp(-margin / 100));

const updateFromRace = (first, second) => {
  const score = scoreFromMargin(second.time - first.time);
  const { a: firstOutcome, b: secondOutcome } = elo.getOutcome(ratings[first.runner], ratings[second.runner], score);
  ratings[first.runner] = firstOutcome.rating;
  ratings[second.runner] = secondOutcome.rating;
};

setDefaultRatings([
  'wooferzfg1',
  'zombiegod96',
  'trogww',
  'gymnast86',
  'neefezmc',
  'deanx420',
  'JarheadHME',
  'Samura1man',
  'linkus7',
  'WindsRequiem',
  'Leumas342',
  'Riekelt',
  'Praecipua',
  'SiYes',
  'brightwolfz',
  'lolicry',
  'shebbi_',
  'OnlyFriendlyGuy',
  'Cal'
]);

_.forEachRight(raceResults, (results) => {
  for (let i = 0; i < results.length - 1; i++) {
    const first = results[i];
    for (let j = i + 1; j < results.length; j++) {
      const second = results[j];
      if (_.has(ratings, first.runner) && _.has(ratings, second.runner)) {
        updateFromRace(first, second);
      }
    }
  }
});

const sortedRatings = _.fromPairs(_.sortBy(_.toPairs(ratings), 1).reverse());

console.log(sortedRatings);
