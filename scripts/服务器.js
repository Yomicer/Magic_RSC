// var Material = Java.type('org.bukkit.Material');
// var BlockBreakEvent = Java.type('org.bukkit.event.block.BlockBreakEvent');
// var SlimefunItem = Java.type('io.github.thebusybiscuits.slimefun4.api.items.SlimefunItem');



//监听破坏sf方块
// function onSlimefunBlockBreak(event){

//     let blockBroken = event.getBlockBroken(); // 获取被破坏的方块

//     let item = event.getBlockBroken()
//     org.bukkit.Bukkit.broadcastMessage("掉落物:"+ item);

//     let player = event.getPlayer()

//     let sfItem = event.getSlimefunItem()

//     org.bukkit.Bukkit.broadcastMessage("物品:"+ sfItem);

//     // if sfItem = 123 ;

//     event.setCancelled(true);

//     // 使用 /setblock 命令来覆盖该位置的方块
//     let location = blockBroken.getLocation();

//     let x = Math.floor(location.getX()); // 将 X 坐标转换为整数
//     let y = Math.floor(location.getY()); // 将 Y 坐标转换为整数
//     let z = Math.floor(location.getZ()); // 将 Z 坐标转换为整数

//     org.bukkit.Bukkit.broadcastMessage("坐标:"+ location.toString());


// }

// function onBlockBreak(event){

//     let block = event.getBlock();
//     itemstack = event.getBlock().getDrops();
//     // 尝试获取与 ItemStack 关联的 SlimefunItem

//     org.bukkit.Bukkit.broadcastMessage("物品1:"+ itemstack);


//     let slimefunItem = SlimefunItem.getByItem(itemstack);

//     let sfid = slimefunItem.getId();



//     org.bukkit.Bukkit.broadcastMessage("物品:"+ sfid);

// }


function onPlayerPickupItem(event){

    // 定义需要检查的 Slimefun 物品 ID 范围
    const CARGO_STORAGE_UNITS = [
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_1",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_2",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_3",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_4",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_5",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_6",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_7",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_8",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_9",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_10",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_11",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_12",
    "NTW_EXPANSION_CARGO_STORAGE_UNIT_13"
    ];
    let item = event.getItem();

    let player = event.getPlayer();

    let world = player.getWorld();

    let eyeLocation = player.getEyeLocation();

    var itemstack = item.getItemStack();

    // 尝试获取与 ItemStack 关联的 SlimefunItem
    let slimefunItem = getSfItemByItem(itemstack);


    // org.bukkit.Bukkit.broadcastMessage("物品:"+ sfid);

    
    // 打印调试信息
    // org.bukkit.Bukkit.broadcastMessage("拾起的物品类型: " + item.getType());
    if (slimefunItem != null) {
        // org.bukkit.Bukkit.broadcastMessage("对应的 SlimefunItem ID: " + slimefunItem.getId());
        
    } else {
        // org.bukkit.Bukkit.broadcastMessage("未找到对应的 SlimefunItem");
        return ;
    }

    // 检查是否存在关联的 SlimefunItem 并且是否在指定范围内
    if (slimefunItem != null && CARGO_STORAGE_UNITS.some(unit => unit === slimefunItem.getId())) {
        // 取消物品拾取事件
        // event.setCancelled(true);
        let meta = itemstack.getItemMeta();
            if (meta != null) {
                let lore = meta.getLore();

                // 保留前6行 Lore
                
                // 保留第1到第6行和第8到第10行 Lore
                let preservedLore = [...lore.slice(0, 6), ...lore.slice(7, 10)];

                // 添加新的 Lore 行
                let newLoreLine = "§c§l樱§e§l缘§d§l梦§c§l之§b§l乡§a§l粘§b§l液§c§l科§d§l技§e§l服§f§l务§5§l器§6§l定§7§l制"; // 彩色字体

                // 合并旧的 Lore 和新的 Lore 行
                let updatedLore = [...preservedLore, newLoreLine];
                meta.setLore(updatedLore);

                meta.setDisplayName("§a失§b去§c魔§d法§e的§f抽§3屉§4（§1网§2络§5抽§6屉§7）[如果还是模型形态则可以继续使用]"); // 使用颜色代码 §a 表示绿色
                itemstack.setItemMeta(meta);
                // 修改物品材质为石头
                // itemstack.setType(org.bukkit.Material.STONE);
                // 更新物品实体以反映新的 displayName
                item.setItemStack(itemstack);
            }

        // 移除物品实体
        // item.remove();
        playIgniteTNTSound(world, eyeLocation);
        

        // 广播调试信息（可选）
        org.bukkit.Bukkit.broadcastMessage("§b玩家"+player.getName()+"§3的§a魔§b法§c抽§d屉§5被§e封§f印§6了§4=====");
    }


}


//闪电
function playIgniteTNTSound(world, location) {
    const TNT_IGNITE_SOUND_NAME = "item.totem.use"; // 使用完整的命名空间字符串
    const VOLUME = 1.0; // 音量
    const PITCH = 0.01; // 音调

    // 播放点燃TNT的音效，使用声音名称字符串
    world.playSound(location, TNT_IGNITE_SOUND_NAME, VOLUME, PITCH);
}