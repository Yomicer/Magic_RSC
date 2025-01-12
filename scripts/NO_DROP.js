function onBreak(event) {
    // 获取玩家对象
    let player = event.getPlayer();

    // 阻止方块掉落物品
    event.setDropItems(false);

    // 这里不需要额外操作来破坏方块，因为事件默认会处理这个行为

    // 通知玩家
    player.sendMessage("§7[系统] §f你已破坏方块，但不会有掉落物。");

}