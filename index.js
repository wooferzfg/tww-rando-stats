const _ = require('lodash');
const data = require('./data');
const Elo = require('@pelevesque/elo');

const elo = new Elo({ k: 40 });
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

const scoreFromMargin = (margin) => 1 / (1 + Math.exp(-margin / 240));

const updateFromRace = (first, second) => {
  const score = scoreFromMargin(second.time - first.time);
  const { a: firstOutcome, b: secondOutcome } = elo.getOutcome(ratings[first.runner], ratings[second.runner], score);
  ratings[first.runner] = firstOutcome.rating;
  ratings[second.runner] = secondOutcome.rating;
};

const sortRatings = (unsortedRatings) => _.fromPairs(_.sortBy(_.toPairs(unsortedRatings), 1).reverse());

setDefaultRatings([
  'wooferzfg1',
  'JarheadHME',
  'gymnast86',
  'zombiegod96',
  'trogww',
  'deanx420',
  'neefe',
  'jwiste',
  'linkus7',
  'WindsRequiem',
  'Froztbite__',
  'Praecipua',
  'Samura1man',
  'Leumas342',
  'Tubamann',
  'squez',
  'SiYes',
  'Riekelt',
  'OriginalElijah',
  'Copilot'
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

const sortedRatings = sortRatings(ratings);

console.log(sortedRatings);
