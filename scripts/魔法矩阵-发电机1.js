const HashMap = Java.type('java.util.HashMap');
const ItemStack = org.bukkit.inventory.ItemStack;
const Material = org.bukkit.Material;
const ChatColor = org.bukkit.ChatColor;

// 定义所有发电机类型及其发电率（每单位数量的发电量）和初始槽位
const GENERATOR_TYPES = [
    { id: "SUPREME_BASIC_VENTUS_GENERATOR", name: "基础风力发电机", slot: 45, power: 5000 ,material: Material.LIGHT_BLUE_CONCRETE},
    { id: "INFINITE_PANEL", name: "无尽发电机", slot: 46, power: 120000 ,material: Material.LIGHT_BLUE_GLAZED_TERRACOTTA},
    { id: "VOID_PANEL", name: "虚空发电机", slot: 47, power: 6000,material: Material.LIGHT_GRAY_GLAZED_TERRACOTTA},
    { id: "CELESTIAL_PANEL", name: "超级太阳能发电机", slot: 48, power: 1500 ,material: Material.YELLOW_GLAZED_TERRACOTTA},
    { id: "ADVANCED_PANEL", name: "高级太阳能发电机", slot: 49, power: 300 ,material: Material.RED_GLAZED_TERRACOTTA},
    { id: "MAGIC_NEWPLAYER_SOLAR_GENERATOR", name: "为爱发电机", slot: 50, power: 100 ,material: Material.DAYLIGHT_DETECTOR},
    { id: "WATER_TURBINE", name: "水利涡轮发电机", slot: 51, power: 128 ,material: Material.PRISMARINE_WALL},
    { id: "SOLAR_GENERATOR_4", name: "充能太阳能发电机", slot: 52, power: 256 ,material: Material.DAYLIGHT_DETECTOR}
];

// 创建用于存储每个机器独立计数器的HashMap
var machineTickCounters = new HashMap();

function tick(info) {
    var location = info.block().getLocation();
    let containerLocation = location.clone().add(0, 1, 0);

    let sfitem =  StorageCacheUtils.getSfItem(containerLocation);
    if (sfitem == null){
        // org.bukkit.Bukkit.broadcastMessage("不是一个粘液物品");
        return;
    }
    
    let sfitemid = sfitem.getId()

    if (!(sfitemid === "MAGIC_POWER_MIX_BOX_1")){

        // org.bukkit.Bukkit.broadcastMessage("不是对应机器");
        return;


    }


    var blockMenu = StorageCacheUtils.getMenu(containerLocation); // 获取容器背包

    if (blockMenu != null) {
        let totalPower = 0;

        // 初始化所有槽位为"停止发电"
        initializeSlots(blockMenu);
        let item53 = createItem(Material.RED_STAINED_GLASS_PANE, ChatColor.RED + "停止发电", [ChatColor.GRAY + "魔法矩阵：" + ChatColor.YELLOW + "发电机"]);
        blockMenu.addItem(53, item53);

        // 处理所有发电机类型并累加总发电量
        for (let generator of GENERATOR_TYPES) {
            let itemCount = processGenerator(blockMenu, generator.slot, generator.id);
            totalPower += itemCount * generator.power;
        }

        let iitem53 = createItem(Material.SOUL_LANTERN, ChatColor.GREEN + "发电中", [ChatColor.GRAY + "魔法矩阵：" + ChatColor.YELLOW + "发电机" ,ChatColor.GRAY + "发电速度：" + ChatColor.AQUA + totalPower + ChatColor.GRAY + " J/s"]);
        blockMenu.addItem(53, iitem53);

        if (totalPower <= 0){
            // org.bukkit.Bukkit.broadcastMessage("当前不在发电!");
            return;
        }
        // 广播总发电量
        // org.bukkit.Bukkit.broadcastMessage("当前总发电量为 " + totalPower + " J/s");

        let machine = info.machine();
        // let location = info.block().getLocation();
        // let blockdata = info.block().getBlockData();


        // 调用 getGeneratedOutput 方法来获取当前tick产生的能量
        // let generatedOutput = info.machine().getGeneratedOutput(location, StorageCacheUtils.getBlock(location));
        
        // var blockData = StorageCacheUtils.getBlock(location); // 获取该位置的方块数据

        // blockData.getGeneratedOutput();
        // let production = machine.setEnergyProduction(totalPower)

        // org.bukkit.Bukkit.broadcastMessage("blockData: " + production);


        let addPower = totalPower/2;
        
        machine.addCharge(location, addPower);
        
        

    }

    


}



function initializeSlots(menu) {
    // 设置所有发电机对应的槽位为"停止发电"
    for (let generator of GENERATOR_TYPES) {
        setSlotToStopGenerating(menu, generator.slot, generator.name);
    }
}

function setSlotToStopGenerating(menu, slot, generatorName) {
    let item = createItem(Material.RED_STAINED_GLASS_PANE, ChatColor.RED + "停止发电", [ChatColor.GRAY + "类型：" + ChatColor.BLUE + generatorName]);
    menu.addItem(slot, item);
}

function processGenerator(menu, slot, targetId) {
    let itemCount = countTargetItemsInMenu(menu, targetId);
    updateMachineTicker(machineTickCounters, targetId, itemCount);

    // 替换并设置slot指定位置的物品
    replaceAndSetItem(menu, slot, targetId, itemCount);

    return itemCount; // 返回计数以便在tick函数中使用
}

function countTargetItemsInMenu(menu, targetId) {
    let count = 0;
    for (let i = 0; i < menu.getSize(); i++) {
        let itemStack = menu.getItemInSlot(i);
        if (itemStack != null) {
            let slimefunItem = getSfItemByItem(itemStack);
            if (slimefunItem && slimefunItem.getId() === targetId) {
                count += itemStack.getAmount();
            }
        }
    }
    return count;
}

function updateMachineTicker(tickers, targetId, count) {
    let key = targetId; // 只用目标ID作为键
    tickers.put(key, count);
}

function replaceAndSetItem(menu, slot, targetId, itemCount) {
    if (itemCount === 0) {
        let generator = GENERATOR_TYPES.find(g => g.id === targetId);
        if (generator) {
            setSlotToStopGenerating(menu, slot, generator.name);
        }
    } else {
        let generator = GENERATOR_TYPES.find(g => g.id === targetId);
        if (generator) {
            // let material = Material.generator.material;
            let displayName = ChatColor.GREEN + "发电中";
            let lore = [
                ChatColor.GRAY + "魔法矩阵：" + ChatColor.YELLOW + "发电机",
                ChatColor.GRAY + "类型：" + ChatColor.BLUE + generator.name,
                ChatColor.GRAY + "发电速度：" + ChatColor.AQUA + (itemCount * generator.power) + ChatColor.GRAY + " J/s"
            ];

            let customItem = createItem(generator.material, displayName, lore);
            menu.addItem(slot, customItem);
        }
    }
}

function createItem(material, displayName, lore) {
    let item = new ItemStack(material, 1);
    let meta = item.getItemMeta();
    
    // 设置物品名字
    meta.setDisplayName(displayName);

    // 设置Lore
    meta.setLore(lore);

    item.setItemMeta(meta);
    return item;
}


function onPlace(event) {

    machineTickCounters.clear();
}

function onBreak(event, itemStack, drops) {

    var player = event.getPlayer();
    let world = player.getWorld();
    machineTickCounters.clear();
}