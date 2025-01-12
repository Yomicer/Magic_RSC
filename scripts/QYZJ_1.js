function onWeaponHit(event, player) {

    const damage = event.getDamage();

    // 获取玩家当前和最大健康值
    let currentHealth = player.getHealth();
    let maxHealth = player.getMaxHealth();

    // 计算新的健康值，并确保不超过最大值
    let newHealth = Math.min(currentHealth + (damage * 0.01), maxHealth);

    // 如果新健康值等于最大健康值，则发送通知
    if (newHealth >= maxHealth) {
        player.setHealth(player.getMaxHealth());
        // player.sendMessage("§7[系统] §f你的生命值已满！");
        return;
    }



    player.setHealth(player.getHealth() + (damage * 0.01));

    // player.sendMessage("§7残血");


}
