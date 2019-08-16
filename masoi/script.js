function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /**
                                                                                                                                                                                                            * Player roles. Add roles at your own risk. Values are based on [Ultimate Werewolf](https://en.wikipedia.org/wiki/Ultimate_Werewolf#Roles). The [Wikia page](http://werewolf-the-game.wikia.com/wiki/Main_Page) is also a great resource.
                                                                                                                                                                                                            */
const ROLES = [
{
  id: 'lonewolf',
  name: 'Lone Wolf',
  desc: 'You are a werewolf, but you only win if you are the last wolf team member alive.',
  value: -5,
  isUnique: true,
  isWolf: true,
  requiredTeamRoles: ['werewolf'] },

{
  id: 'werewolf',
  name: 'Werewolf',
  desc: 'Eat a villager each night.',
  value: -6,
  isRequired: true,
  isWolf: true },

{
  id: 'wolfcub',
  name: 'Wolf Cub',
  desc: 'If you die, the werewolves get two kills the following night.',
  value: -8,
  isUnique: true,
  isWolf: true,
  requiredTeamRoles: ['werewolf'] },

{
  id: 'wolfman',
  name: 'Wolf Man',
  desc: 'You wake with the other Werewolves each night, but the Seer sees you as a Villager.',
  value: -9,
  isUnique: true,
  isWolf: true,
  requiredTeamRoles: ['werewolf'],
  requiredOpposingTeamRoles: ['seer'] },

{
  id: 'seer',
  name: 'Seer',
  desc: 'Each night, point at a player and learn if they are good or evil.',
  value: 7,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'witch',
  name: 'Witch',
  desc: 'Kill or save a player, once each per game.',
  value: 4,
  isSelected: true,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'hunter',
  name: 'Hunter',
  desc: 'If you are killed, take someone down with you.',
  value: 3,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'priest',
  name: 'Priest',
  desc: 'On the first night, protect a player. The next attempt to kill the player fails. The night after that attempt, you protect a different player.',
  value: 3,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'bodyguard',
  name: 'Bodyguard',
  desc: 'Choose a different player each night to protect. That player cannot be killed that night.',
  value: 3,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'martyr',
  name: 'Martyr',
  desc: 'Take the place of someone who has been killed before their role is revealed.',
  value: 3,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'village',
  name: 'Village Idiot',
  desc: 'Always vote for players to die.',
  value: 2,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'ghost',
  name: 'Ghost',
  desc: 'Die the first night, then each day, write one letter clues as a message from the beyond (no names or initials).',
  value: 2,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'spellcaster',
  name: 'Spellcaster',
  desc: 'At night, indicate a player who must not use their voice the following day.',
  value: 1,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] },

{
  id: 'villager',
  name: 'Villager',
  desc: 'Find the werewolves and lynch them.',
  isRequired: true,
  isWolf: false,
  value: 1 },

{
  id: 'lycan',
  name: 'Lycan',
  desc: 'You are a villager, but you appear falsely to be a werewolf to the Seer.',
  value: -1,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['seer'] },

{
  id: 'cupid',
  name: 'Cupid',
  desc: 'Choose two players to be lovers. If one of those players dies, the other dies from a broken heart.',
  value: -2,
  isUnique: true,
  isWolf: false,
  requiredTeamRoles: ['villager'] }];





// React
const { PropTypes } = React;

/**
                              * Generator default settings
                              */
const DEFAULT_PLAYERS = 10,
DEFAULT_VILLAGERS = 50;

/**
                         * Generator constants
                         */
const MIN_PLAYERS = 6,
MAX_PLAYERS = 68;

/**
                   * Weighted random
                   * @source https://github.com/btmills/weighted-random
                   * @param {number[]} weights - A list of numbers representing weights.
                   * @returns {number} An index in the list, selected based on the given weights.
                   */
function weightedRandom(weights) {
  var totalWeight = 0,
  i,random;

  for (i = 0; i < weights.length; i++) {
    totalWeight += weights[i];
  }

  random = Math.random() * totalWeight;

  for (i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return i;
    }

    random -= weights[i];
  }

  return -1;
}

/**
   * Generator
   */
class Generator extends React.Component {

  /**
                                          * Expected input data
                                          */









  /**
                                              * Default input data
                                              */




  /**
                                                  * Generator magic math to calculate the number of "evil people" based on the number of players.
                                                  * @source https://www.boardgamegeek.com/filepage/47953/lazs-ultimate-werewolf-ultimate-edition-customized
                                                  * @param {integer} players
                                                  * @return {integer} number - number of evil people needed
                                                  */
  static getNumberOfEvilPeople(players) {
    return Math.ceil((players - 4.5) / 3.5); // This is the math used in Laz's spreadsheet. It feels like too many werewolves to me.
  }

  /**
     * Get team value
     * @param {array} team
     * @return {integer} value
     */
  static getTeamValue(team) {
    let value = 0;
    team.forEach(role => value += role.value);
    return value;
  }

  /**
     * Check if role is eligible for given team
     * @param {object} role
     * @param {array} team
     * @return {bool}
     */
  static checkTeamEligibility(role, team) {
    // Make sure that unique roles isn't already on the team
    if (role.isUnique && team.find(player => player.id === role.id)) {
      return false;
    }

    // Make sure selected role has required roles
    if (role.requiredTeamRoles) {
      for (let i = 0; i < role.requiredTeamRoles.length; i++) {
        let requiredRole = role.requiredTeamRoles[i];
        if (!team.find(role => role.id === requiredRole)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
     * Select removes any unique roels from `roles` if they exists in `team`
     * @param {array} roles
     * @param {array} team
     * @return {array}
     */
  static removeUniques(roles, team) {
    return roles.filter((role) =>
    !(
    role.isUnique &&
    team.findIndex(member => member.id === role.id) > -1));


  }

  /**
     * Select random role from roles
     * @param {array} roles
     * @param {integer} targetPoints
     * @return {object} role
     */
  static selectRandomRole(roles, targetPoints) {
    let role;

    if (typeof targetPoints === 'number' && !isNaN(targetPoints)) {
      let weights = roles.map(role => Math.abs(role.value - targetPoints)),
      maxDistance = 0;

      weights.forEach(distance => maxDistance = distance > maxDistance ? distance : maxDistance);

      weights = weights.map(distance => Math.abs(distance - maxDistance));
      role = roles[weightedRandom(weights)]; // This might return `-1` if all available roles is at an equal distance from the `targetPoints` value.
    }

    return role || roles[Math.floor(Math.random() * roles.length)];
  }

  /**
     * Add players to given team
     * @param {array} team
     * @param {array} roles
     * @param {integer} limit
     * @param {integer} limit
     * @param {integer} targetPoints
     */
  static addPlayers(team = [], roles, limit, targetPoints, opposingTeam = []) {
    const hasTargetPoints = typeof targetPoints === 'number',
    role = Generator.selectRandomRole(
    Generator.removeUniques(roles, team),
    hasTargetPoints ? targetPoints / (limit - team.length) : undefined);


    // Add player to team
    if (Generator.checkTeamEligibility(role, [...team, ...opposingTeam])) {
      team = [
      ...team,
      role];

      targetPoints = hasTargetPoints ? targetPoints - role.value : undefined;
    }

    // Return team (or build recursively)
    return team.length === limit ? team : Generator.addPlayers(team, roles, limit, targetPoints);
  }

  /**
     * Constructor. Set up state
     */
  constructor(props) {
    super(props);

    this.state = {
      roles: [],
      players: DEFAULT_PLAYERS,
      plainVillagersPct: DEFAULT_VILLAGERS };

  }

  /**
     * Update internal roles on mount
     */
  componentWillMount() {
    this.updateRoles();
  }

  /**
     * Update internal roles on new props
     */
  componentWillReceiveProps(nextProps) {
    this.updateRoles(nextProps);
  }

  /**
     * Generate evil team
     */
  generateEvilPeople() {
    const { roles, players } = this.state;

    // Add random evil people
    const numberOfEvilPeople = Generator.getNumberOfEvilPeople(players),
    viableEvilPeople = roles.filter(role => role.isWolf && role.isSelected),
    evilPeopleTargetValue = Generator.getTeamValue(viableEvilPeople) / viableEvilPeople.length * numberOfEvilPeople; // Base target value for evil people on the average value of the selected evil roles

    return Generator.addPlayers([], viableEvilPeople, numberOfEvilPeople, evilPeopleTargetValue);
  }

  /**
     * Generate good team
     */
  generateGoodPeople(evilPeople) {
    const evilPeopleValue = Generator.getTeamValue(evilPeople),
    numberOfEvilPeople = evilPeople.length;

    const { roles, players, plainVillagersPct } = this.state;

    let goodPeople = [];

    // Add plain villages
    const numberOfGoodPeople = players - numberOfEvilPeople,
    numberOfPlainVillagers = Math.floor(numberOfGoodPeople * plainVillagersPct / 100),
    plainVillager = roles.find(role => role.id === 'villager'),
    viableGoodPeople = roles.filter(role => !role.isWolf && role.isSelected);


    for (let i = 0; i < numberOfPlainVillagers; i++) {
      goodPeople.push(plainVillager);
    }

    // Add required roles from opposing team
    evilPeople.forEach(opponent => {
      if (opponent.requiredOpposingTeamRoles) {
        opponent.requiredOpposingTeamRoles.
        forEach(id => goodPeople.push(roles.find(role => role.id === id)));
      }
    });

    let goodPeopleValueRemaining = evilPeopleValue * -1 - Generator.getTeamValue(goodPeople);

    return Generator.addPlayers(goodPeople, viableGoodPeople, numberOfGoodPeople, goodPeopleValueRemaining);
  }

  /**
     * Generate game. Lot's of recursive guessing logic in here.
     */
  generate() {
    // Build evil people team
    const evilPeople = this.generateEvilPeople();

    // Build good people team
    const goodPeople = this.generateGoodPeople(evilPeople);

    // Set state
    this.setState({
      ...this.state,
      results: {
        timestamp: Date.now(),
        evilPeople,
        goodPeople } });


  }

  /**
     * Update amount of players
     * @param {integer} value
     */
  updatePlayers(value) {
    this.setState({
      ...this.state,
      players: isNaN(parseInt(value, 10)) ? DEFAULT_PLAYERS : value });

  }

  /**
     * Update amount of plain villages
     * @param {integer} value
     */
  updatePlainVillagersPct(value) {
    this.setState({
      ...this.state,
      plainVillagersPct: isNaN(parseInt(value, 10)) ? DEFAULT_VILLAGERS : value });

  }

  /**
     * Update roles in state from props
     * @param {integer} value
     */
  updateRoles({ roles } = this.props) {
    this.setState({
      ...this.state,
      roles: roles.map(role => ({
        ...role,
        isSelected: role.isSelected || role.isRequired })) });


  }

  /**
     * Update single role in state
     * @param {string} id
     * @param {bool} isSelected
     */
  updateRole(id, isSelected) {
    const { roles } = this.state,
    activeRole = roles.find(role => role.id === id),
    newRoles = [];

    roles.forEach(role => {
      // Update the selected role
      if (role.id === activeRole.id) {
        newRoles.push({
          ...role,
          isSelected });

      }

      // If we're activating a role, make sure all its requiredTeamRoles also are activated
      else if (isSelected && (
        activeRole.requiredTeamRoles && activeRole.requiredTeamRoles.indexOf(role.id) > -1 ||
        activeRole.requiredOpposingTeamRoles && activeRole.requiredOpposingTeamRoles.indexOf(role.id) > -1))
        {
          newRoles.push({
            ...role,
            isSelected: true });

        }

        // If we're deactivating a role, make sure all roles dependent on it also are deactivated
        else if (!isSelected && (
          role.requiredTeamRoles && role.requiredTeamRoles.indexOf(activeRole.id) > -1 ||
          role.requiredOpposingTeamRoles && role.requiredOpposingTeamRoles.indexOf(activeRole.id) > -1))
          {
            newRoles.push({
              ...role,
              isSelected: false });

          } else

          {
            newRoles.push({ ...role });
          }
    });

    this.setState({
      ...this.state,
      roles: newRoles });

  }

  /**
     * Render role selector
     */
  renderRoles() {
    const { roles } = this.state;
    return (
      React.createElement("section", { className: "generator__roles" },
      React.createElement("h3", { className: "generator__roles-title" }, "Pick your roles"),
      roles.map(({ id, name, value, desc, isSelected, isRequired, isWolf }, index) =>
      React.createElement("fieldset", { className: "generator__role" },
      React.createElement("input", { className: "generator__checkbox", id: 'role-' + index, name: name, type: "checkbox", checked: isSelected, disabled: isRequired, value: value, onChange: event => this.updateRole(id, event.target.checked) }),
      React.createElement("label", { className: "generator__switch", htmlFor: 'role-' + index }),
      React.createElement("label", { className: "generator__label", htmlFor: 'role-' + index },
      name, " ", this.renderBadge({ name, value, desc, isWolf }))))));





  }

  /**
     * Render settings input
     */
  renderSettings() {
    return (
      React.createElement("section", { className: "generator__settings" },
      React.createElement("h3", { className: "generator__settings-title" }, "Set up your game"),
      React.createElement("fieldset", { className: "generator__setting" },
      React.createElement("input", { className: "generator__input", id: "players", name: "players", type: "number", pattern: "[0-9]*", min: MIN_PLAYERS, max: MAX_PLAYERS, onChange: event => this.updatePlayers(event.target.value), value: this.state.players }),
      React.createElement("label", { className: "generator__label", htmlFor: "players" }, "players")),



      React.createElement("fieldset", { className: "generator__setting" },
      React.createElement("input", { className: "generator__input", id: "players", name: "plainVillagersPct", type: "number", pattern: "[0-9]*", min: "0", max: "100", onChange: event => this.updatePlainVillagersPct(event.target.value), value: this.state.plainVillagersPct }),
      React.createElement("label", { className: "generator__label", htmlFor: "plainVillagersPct" }, "percent villagers, minimum"))));





  }

  /**
     * Render generate section
     */
  renderGenerate() {
    return (
      React.createElement("section", { className: "generator__generate" },
      React.createElement("h3", { className: "generator__generate-title" }, "Generate your game"),
      React.createElement("button", { type: "submit", className: "generator__button" }, this.state.results ? 'Regenerate' : 'Generate', " your game now \u2192")));


  }

  /**
     * Render results section
     */
  renderResults() {
    const { results } = this.state,
    date = results && new Date(results.timestamp);

    return results &&
    React.createElement("section", { className: "generator__results" },
    React.createElement("h3", { className: "generator__results-title" }, "Your game"),
    React.createElement("div", { className: "generator__results-desc" },
    React.createElement("p", null, "Generated on ", date.toLocaleTimeString(), ", ", date.toLocaleDateString(), ".")),

    this.renderTeam(results.evilPeople, 'Werewolf team'),
    this.renderTeam(results.goodPeople, 'Villager team'));


  }

  /**
     * Render results for single team
     * @param {array} team
     * @param {string} title
     */
  renderTeam(team, title) {
    return (
      React.createElement("section", { className: "generator__results-team" },
      React.createElement("h4", { className: "generator__team-title" }, title, " (", Generator.getTeamValue(team), ")"),
      React.createElement("ul", { className: "generator__team-list" },

      team.
      sort((a, b) => Math.abs(a.value) < Math.abs(b.value)).
      map((role, index) =>
      React.createElement("li", { key: index },
      role.name, " ", this.renderBadge(role))))));






  }

  /**
     * Render badge for single role
     * @param {object} role
     */
  renderBadge({ name, desc, value, isWolf }) {
    return React.createElement("span", { className: 'generator__badge' + ' generator__badge--' + (isWolf ? 'evil' : 'good'), title: desc ? name + ': ' + desc : name }, value);
  }

  /**
     * React lifecycle. Main render function.
     */
  render() {
    return (
      React.createElement("form", { className: "generator", onSubmit: event => {
          event.preventDefault();
          this.generate();
        } },
      this.renderSettings(),
      this.renderRoles(),
      this.renderResults(),
      this.renderGenerate()));


  }}




/**
      * Start app
      */_defineProperty(Generator, "propTypes", { roles: PropTypes.arrayOf(PropTypes.shape({ desc: PropTypes.string, isRequired: PropTypes.bool, name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired });_defineProperty(Generator, "defaultProps", { roles: ROLES });
ReactDOM.render(
React.createElement(Generator, null),
document.getElementById('generator'));



// Stop codepen's pesky loop detection - https://codepen.io/quezo/post/stopping-infinite-loops
window.CP.shouldStopExecution = function () {return false;};