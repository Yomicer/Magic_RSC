// 导入必要的 Java 类型
const Sound = Java.type('org.bukkit.Sound');
const Bukkit = Java.type('org.bukkit.Bukkit');

// 自动收集所有 Minecraft 音效名称到数组中，并将下划线替换为点号，添加命名空间前缀
function collectAllSoundNames() {
    const soundNames = [];
    for (let sound of Sound.values()) {
        let soundKey = sound.name(); // 获取枚举常量的名称
        let soundName = soundKey.toLowerCase().split('_').join('.'); // 使用 split 和 join 替换下划线为点号
        soundNames.push(soundName);
    }
    return soundNames;
}

// 获取所有音效名称的数组
const RANDOM_SOUND_NAME_ARRAY = collectAllSoundNames();

// 辅助函数用于从数组中随机选择一个音效名称
function getRandomSoundName(soundArray) {
    const randomIndex = Math.floor(Math.random() * soundArray.length);
    return soundArray[randomIndex];
}

// 辅助函数用于播放随机音效给所有在线玩家
function playRandomSoundToAll(world, location) {
    const VOLUME = 1.0; // 音量
    const PITCH = 1.0; // 音调

    // 获取所有在线玩家
    let onlinePlayers = Bukkit.getOnlinePlayers();

    // 为每个在线玩家播放随机音效
    onlinePlayers.forEach(function(player) {
        let randomSoundName = getRandomSoundName(RANDOM_SOUND_NAME_ARRAY);
        player.getWorld().playSound(location, randomSoundName, VOLUME, PITCH);
        // player.sendMessage("声音：" + randomSoundName);
    });

    

}

// 发送消息给玩家
function sendMessage(player, message) {
    player.sendMessage(message);
}



function tick(info) {
    var machine = info.machine();
    var location = info.block().getLocation();
    let world = location.getWorld();


    // 播放随机音效给所有在线玩家
    playRandomSoundToAll(world, location);




}