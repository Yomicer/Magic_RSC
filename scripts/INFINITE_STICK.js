function onWeaponHit(event, player, item) {
    const entity = event.getEntity();
    if (entity instanceof org.bukkit.entity.Player) {
        entity.setHealth(0);


        const invs = player.getInventory();
        const itemInMainHand = invs.getItemInMainHand();

        
        if (itemInMainHand.getAmount() > 1) {
            itemInMainHand.setAmount(itemInMainHand.getAmount() - 1);
        }
        else {
            invs.setItemInMainHand(null); // 如果只剩下一个，则移除物品
        }

    } 


}
