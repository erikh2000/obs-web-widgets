const _getResetTime = (cooldownDuration:number) => -cooldownDuration;

class Cooldown {
  cooldownDuration:number;
  lastActivateTime:number;

  constructor(cooldownDuration:number) {
    this.cooldownDuration = cooldownDuration;
    this.lastActivateTime = _getResetTime(cooldownDuration);
  }

  // Return true and restart cooldown if cooldown time has elapsed. Otherwise, return false.
  activate(cooldownDuration?:number):boolean {
    const checkTime = Date.now();
    if (checkTime - this.lastActivateTime < this.cooldownDuration) return false;
    this.lastActivateTime = checkTime;
    if (cooldownDuration !== undefined) this.cooldownDuration = cooldownDuration;
    return true;
  }

  reset(){
    this.lastActivateTime = _getResetTime(this.cooldownDuration);
  }
}

export default Cooldown;