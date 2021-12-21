const { dictionary } = require(`./dictionary`);
const {
  types,
  areas,
  cities,
  postcodes,
  features,
  descriptions,
  agentNames,
  agentAddresses,
  agentPhones,
} = dictionary;

const totalProperties = 10;
const totalAgents = 3;

const helperFunctions = {
  randMinMax: function (min, max) {
    return (
      Math.random() * (max.toFixed(9) - min.toFixed(9) + 1) +
      min
    ).toFixed(9);
  },
  randMinMaxFloor: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  geoBetween: function (latStart, latEnd, longStart, longEnd) {
    // between Oswentry and Scarsborough
    // geoBetween(52.8571472, 54.2755982, -0.4477916, -3.0933436)

    const diffLat = latStart * 10000000 - latEnd * 10000000;
    const lat = latEnd + (Math.random() * diffLat) / 10000000;

    const diffLong = longStart * 10000000 - longEnd * 10000000;
    const long = longEnd + (Math.random() * diffLong) / 10000000;

    return { lat, long };
  },
  randArrEle: function (arr) {
    // return arr[Math.floor(Math.random() * arr.length) + 1];
    return arr[Math.floor(Math.random() * arr.length)];
  },
  randIndex: function (arr) {
    return Math.floor(Math.random() * arr.length);
  },
  generateProperty: function () {
    const rand = this.randMinMaxFloor(333, 3333);
    const rent = rand - (rand % 5);

    const bedrooms = this.randMinMaxFloor(1, 5);
    const area = this.randArrEle(areas);
    const city = this.randArrEle(cities);
    const type = this.randArrEle(types);
    const index = this.randMinMaxFloor(1, 99);
    const imageIndex = ("0" + index).slice(-2);
    const imageSrc = `/images/properties/property (${imageIndex}).jpg`;

    const propertyObject = {
      agentCode: (`0` + this.randMinMaxFloor(1, totalAgents)).slice(-2),
      title: `${bedrooms}BHK ${type} in ${area}`,
      // type: types[Math.floor(Math.random() * types.length)],
      type: type,
      image: imageSrc,
      rent: rent,
      area: area,
      city: city,
      postcode: this.randArrEle(postcodes),
      bedrooms: bedrooms,
      bathrooms: this.randMinMaxFloor(1, 3),
      latitude: this.randMinMax(53.327049, 53.639302),
      longitude: this.randMinMax(-2.094019, -2.73582),
      features: [
        this.randArrEle(features),
        this.randArrEle(features),
        this.randArrEle(features),
        this.randArrEle(features),
        this.randArrEle(features),
        this.randArrEle(features),
      ],
      description: `
${this.randArrEle(
  descriptions
)} The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word "and" and the Little Blind Text should turn around and return to its own, safe country.

${this.randArrEle(
  descriptions
)} Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.

${this.randArrEle(
  descriptions
)} Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way.`,
    };

    return propertyObject;
  },
  generateAgent: function (code) {
    const codeString = (`0` + code).slice(-2);
    const logoSrc = `/images/agentLogos/${agentNames[code]}.jpeg`;

    const agentObject = {
      agentCode: codeString,
      name: agentNames[code],
      logo: logoSrc,
      address: agentAddresses[code],
      phone: agentPhones[code],
      // name: this.randArrEle(agentNames),
      // address: this.randArrEle(agentAddresses),
      // phone: this.randArrEle(agentPhones),
    };
    return agentObject;
  },
};

function generatePropertyFromForm(o) {
  // o is the req.body object that contains /properties/add form data
  const { randMinMax, randMinMaxFloor, randArrEle } = helperFunctions;

  const bedrooms = o.bedrooms || randMinMaxFloor(1, 5);
  const area = o.area || randArrEle(areas);
  const city = o.city || randArrEle(cities);
  const type = o.type || randArrEle(types);
  const { lat, long } = helperFunctions.geoBetween(
    52.8571472,
    54.2755982,
    -0.4477916,
    -3.0933436
  );

  // form data can have empty features which need to be removed
  const features = [];
  o.features.forEach((feature) => {
    if (feature !== ``) features.push(feature);
  });

  const propertyObject = {
    agentCode: (`0` + randMinMaxFloor(1, totalAgents)).slice(-2),
    title: o.title || `${bedrooms}BHK ${type} in ${area}`,
    // type: types[Math.floor(Math.random() * types.length)],
    type: type.toLowerCase(),
    rent: o.rent || randMinMaxFloor(333, 3333),
    area: area,
    city: city,
    postcode: o.postcode || randArrEle(postcodes),
    bedrooms: bedrooms,
    bathrooms: o.bathrooms || randMinMaxFloor(1, 3),
    latitude: o.latitude || lat,
    longitude: o.longitude || long,
    features: features || [
      randArrEle(features),
      randArrEle(features),
      randArrEle(features),
      randArrEle(features),
      randArrEle(features),
      randArrEle(features),
    ],
    description:
      o.description ||
      `${this.randArrEle(
        descriptions
      )} The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word "and" and the Little Blind Text should turn around and return to its own, safe country.

        ${this.randArrEle(
          descriptions
        )} Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.

        ${this.randArrEle(
          descriptions
        )} Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way.`,
  };

  return propertyObject;
}

module.exports.totalAgents = totalAgents;
module.exports.totalProperties = totalProperties;
module.exports.helperFunctions = helperFunctions;
module.exports.generatePropertyFromForm = generatePropertyFromForm;
