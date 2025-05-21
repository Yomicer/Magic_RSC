const Particle = Java.type('org.bukkit.Particle');
const getPlayerData = (event) => {
    let playerData = {};
    playerData.player = event.getPlayer();
    playerData.world = playerData.player.getWorld();
    playerData.location = playerData.player.getLocation();
    playerData.playerName = playerData.player.getName();
    playerData.worldName = playerData.world.getName();
    playerData.XNum = playerData.location.getX().toFixed(2);
    playerData.YNum = playerData.location.getY().toFixed(2);
    playerData.ZNum = playerData.location.getZ().toFixed(2);
    // 提取 Yaw 和 Pitch
    playerData.yaw = parseFloat(playerData.location.getYaw().toFixed(2)); // 水平方向
    playerData.pitch = parseFloat(playerData.location.getPitch().toFixed(2)); // 垂直方向
    return playerData;
};

const mainHandItem = (player) => {
    return player.getInventory().getItemInMainHand();
}

const MainHandIf = (hand) => {
    if (hand !== org.bukkit.inventory.EquipmentSlot.HAND) {
        return true;
    } else {
        return false;
    }
}

//播放声音
const playTPSound=(world, location) => {
    const SOUND_NAME = "block.portal.travel"; // 使用完整的命名空间字符串
    const VOLUME = 1.0; // 音量
    const PITCH = 1.0; // 音调

    // 播放点燃TNT的音效，使用声音名称字符串
    world.playSound(location, SOUND_NAME, VOLUME, PITCH);
}

const setLocation = (itemStack,playerData,player) => {
    // 获取物品的元数据
    let meta = itemStack.getItemMeta();
    // 获取当前的 Lore 列表
    let lore = meta.getLore();
    // 修改第 6-10 行的内容（索引从 0 开始，所以是 5-9）
    lore[5] = "§b坐标创建者：" + playerData.playerName;
    lore[6] = "§a世界：" + playerData.worldName;
    lore[7] = "§eX：" + parseFloat(playerData.XNum).toFixed(2);
    lore[8] = "§eY：" + parseFloat(playerData.YNum).toFixed(2);
    lore[9] = "§eZ：" + parseFloat(playerData.ZNum).toFixed(2);
    lore[10] = "§e水平方向：" + playerData.yaw.toFixed(2);
    lore[11] = "§e垂直方向：" + playerData.pitch.toFixed(2);
    
    // 更新 Lore
    meta.setLore(lore);
    // 将更新后的元数据应用回物品
    itemStack.setItemMeta(meta);
    player.sendMessage("§b设置了新的坐标~");
}

const getEntityExample = (event) => {
    let player = event.getPlayer();
    // 获取触发事件的玩家对象
    let world = player.getWorld();
    let eyeLocation = player.getEyeLocation();
    let direction = eyeLocation.getDirection();

    // 计算射线起点位置（眼睛位置向下0.8个单位并加上方向向量）
    let startLocation = eyeLocation.clone().subtract(0, 0, 0).add(direction);
    let maxDistance = 10;

    // 加载必要的 Java 类型
    var FluidCollisionMode = Java.type('org.bukkit.FluidCollisionMode');

    // 执行射线追踪
    let rayTraceResults = world.rayTrace(startLocation, direction, maxDistance, FluidCollisionMode.ALWAYS, true, 0, null);

    generateParticleBeam(world, startLocation, direction, maxDistance);

    if (rayTraceResults == null) {
        player.sendMessage("§b要对准哦~§e不会对不准吧？~~~")
        return null;
    }
    let entity = rayTraceResults.getHitEntity();
    if (entity == null){
        player.sendMessage("§b要对准哦~§e不会对不准吧？~~~")
        return null;
    }
    return entity;
}

// 生成粒子效果
const generateParticleBeam = (world, startLocation, direction, maxDistance) => {
    const PARTICLE_TYPE = Particle.VILLAGER_HAPPY; // 使用绿色粒子（农作物催熟）作为示例
    const PARTICLE_INTERVAL = 0.1; // 粒子之间的间隔距离

    for (let distance = 0; distance <= maxDistance; distance += PARTICLE_INTERVAL) {
        let particleLocation = startLocation.clone().add(direction.clone().multiply(distance));
        world.spawnParticle(PARTICLE_TYPE, particleLocation.getX(), particleLocation.getY(), particleLocation.getZ(), 0);
    }
}

const toLocation = (itemStack,player,entity) => {
    // 获取物品的元数据
    let meta = itemStack.getItemMeta();
    // 获取当前的 Lore 列表
    let lore = meta.getLore();
    // 提取第 6-9 行的内容（索引 5-8）
    let worldLine = lore[6]; // 第 7 行：世界名称
    let xLine = lore[7];     // 第 8 行：X 坐标
    let yLine = lore[8];     // 第 9 行：Y 坐标
    let zLine = lore[9];     // 第 10 行：Z 坐标
    let yawLine = lore[10];
    let pitchLine = lore[11];

    // 使用正则表达式提取世界名称和坐标值
    let worldMatch = worldLine.match(/.*世界：(.+)/); // 匹配 "世界：" 后面的内容
    let xMatch = xLine.match(/.*X：([\d.-]+)/);       // 匹配 "X：" 后面的数字
    let yMatch = yLine.match(/.*Y：([\d.-]+)/);       // 匹配 "Y：" 后面的数字
    let zMatch = zLine.match(/.*Z：([\d.-]+)/);       // 匹配 "Z：" 后面的数字
    let yawMatch = yawLine.match(/.*水平方向：([\d.-]+)/);       // 匹配 "Z：" 后面的数字
    let pitchMatch = pitchLine.match(/.*垂直方向：([\d.-]+)/);       // 匹配 "Z：" 后面的数字
    // org.bukkit.Bukkit.broadcastMessage("worldMatch:"+ worldMatch);

    // 解析匹配结果
    let worldName = worldMatch ? worldMatch[1] : null; // 提取世界名称
    let xValue = xMatch ? parseFloat(xMatch[1]) : null; // 提取 X 坐标
    let yValue = yMatch ? parseFloat(yMatch[1]) : null; // 提取 Y 坐标
    let zValue = zMatch ? parseFloat(zMatch[1]) : null; // 提取 Z 坐标
    let yaw = yawMatch ? parseFloat(yawMatch[1]) : null; 
    let pitch = pitchMatch ? parseFloat(pitchMatch[1]) : null; 

    if(!worldName){
        player.sendMessage("§c错误：无法找到世界 '" + worldName + "'！");
        return;
    }

    let world = org.bukkit.Bukkit.getWorld(worldName);
    if (!world) {
        player.sendMessage("§c错误：无法找到世界 '" + worldName + "'！");
        return;
    }

    if (isNaN(xValue) || isNaN(yValue) || isNaN(zValue) || isNaN(yaw) || isNaN(pitch)) {
        player.sendMessage("§c错误：无效的坐标值！");
        return;
    }

    // org.bukkit.Bukkit.broadcastMessage("实现传送！");
    // 创建目标位置
    let location = new org.bukkit.Location(world, xValue, yValue, zValue, yaw, pitch);
     // 执行传送
     try {
        let entityName = entity.getName();
        entity.teleport(location);
        player.sendMessage("§b成功将§e" + entityName + "§b传送到世界 '" + worldName + "' 的坐标 X:" + xValue + " Y:" + yValue + " Z:" + zValue + "！");
    } catch (error) {
        player.sendMessage("§c传送失败：" + error.message);
    }

    playTPSound(world,location);

    // 添加粒子效果
    player.getWorld().spawnParticle(org.bukkit.Particle.PORTAL, player.getLocation(), 1500, 1, 1, 1);

}

let playerLastUseTimes = new java.util.HashMap();

function onUse(event) {
    let player = event.getPlayer();
    // 检查主手是否持有物品
    if (MainHandIf(event.getHand())) {
        sendMessage(player, "§b请用主手持物品");
        return;
    }

    let item = mainHandItem(player)

    let playerData = getPlayerData(event);
    // 判断是否为蹲下状态
    let isShift = event.getPlayer().isSneaking()
    if (isShift){
        setLocation(item,playerData,player);
        return;
    }
    const currentTime = new Date().getTime();
    const playerId = player.getUniqueId();
    let lastUseTime = playerLastUseTimes.getOrDefault(playerId, 0);   
    if (currentTime - lastUseTime < 1000) {
        const remainingTime = parseFloat((1000 - (currentTime - lastUseTime)) / 2500).toFixed(5);
        player.sendTitle("§c§l你已经虚脱了！", "距离下次使用还要休息：" + remainingTime + "坤秒", 10, 40, 10);
        return; 
    }
    playerLastUseTimes.put(playerId, currentTime);
    let entity = getEntityExample(event);
    if(!entity){
        return;
    }
    toLocation(item,player,entity);


}