function onUse(event) {
    const player = event.getPlayer();
    //检查主手是否持有物品
    if (event.getHand() !== org.bukkit.inventory.EquipmentSlot.HAND) {
        sendMessage(player, "主手请持物品");
        return;
    }

    const invs = player.getInventory();
    const itemInMainHand = invs.getItemInMainHand();
    let world = player.getWorld();
    let eyeLocation = player.getEyeLocation();


    if (itemInMainHand.getAmount() > 1) {
        itemInMainHand.setAmount(itemInMainHand.getAmount() - 1);

        let ExperienceOrb =  world.spawn(eyeLocation, org.bukkit.entity.ExperienceOrb);
        ExperienceOrb.setCustomName("大量经验球");
        ExperienceOrb.setExperience(11111); // 设置经验值数量
        
        org.bukkit.Bukkit.broadcastMessage("§b"+player.getName()+"§c打碎了魔法学识之瓶§f，§b大量经验喷涌而出~");

    } else {
        invs.setItemInOffHand(null); // 如果只剩下一个，则移除物品

        let ExperienceOrb =  world.spawn(eyeLocation, org.bukkit.entity.ExperienceOrb);
        ExperienceOrb.setCustomName("大量经验球");
        ExperienceOrb.setExperience(11111); // 设置经验值数量

        org.bukkit.Bukkit.broadcastMessage("§b"+player.getName()+"§c打碎了魔法学识之瓶§f，§b大量经验喷涌而出~");
        
    }









}