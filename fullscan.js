/** @param {NS} ns **/
export async function main(ns) {
    async function sendServerDataToNodeServer(serverData) {
        const url = "http://localhost:30001/data"; // Node.js server endpoint
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(serverData));
    }

    async function bfsScanAndListDetails(ns, startServer) {
        let queue = [startServer];
        let scannedServers = new Set([startServer]);
        let serverConnections = new Map();
        let serverData = []; // Collecting data to send to Node.js server
        let links = []; // Array to hold the links for D3.js visualization

        while (queue.length > 0) {
            const currentServer = queue.shift();

            const securityLevel = await ns.getServerSecurityLevel(currentServer);
            const hackingLevel = await ns.getServerRequiredHackingLevel(currentServer);
            const portsRequired = await ns.getServerNumPortsRequired(currentServer);
            const hasRootAccess = await ns.hasRootAccess(currentServer);
            const maxRam = await ns.getServerMaxRam(currentServer);
            const ramUsed = await ns.getServerUsedRam(currentServer);
            let money = "Failed to retrieve money information";

            try {
                money = await ns.getServerMoneyAvailable(currentServer);
            } catch (err) {
                ns.tprint(`Failed to retrieve money information for ${currentServer}: ${err}`);
            }

            let rootAccessMsg = "No root access";
            if (hasRootAccess) {
                rootAccessMsg = "Root access";
            }

            let cpuCores = "Failed to retrieve CPU cores information";
            try {
                const serverObj = ns.getServer(currentServer);
                cpuCores = serverObj.cpuCores;
            } catch (err) {
                ns.tprint(`Failed to retrieve CPU cores information for ${currentServer}: ${err}`);
            }

            const serverInfo = {
                server: currentServer,
                securityLevel,
                hackingLevel,
                portsRequired,
                rootAccessMsg,
                ramUsed: ramUsed.toFixed(2),
                maxRam: maxRam.toFixed(2),
                cpuCores,
                money
            };

            serverData.push(serverInfo);

            const connectedServers = await ns.scan(currentServer);
            serverConnections.set(currentServer, connectedServers);

            for (let i = 0; i < connectedServers.length; i++) {
                const server = connectedServers[i];
                if (!scannedServers.has(server)) {
                    queue.push(server);
                    scannedServers.add(server);
                }

                // Create a link for each connection
                links.push({ source: currentServer, target: server });
            }
        }

        ns.tprint("Network Visualization:");
        serverConnections.forEach((connections, server) => {
            ns.tprint(`${server} -> ${connections.join(', ')}`);
        });

        // Prepare the data for D3.js
        const d3Data = {
            nodes: serverData,
            links: links
        };

        // Send collected server data to the Node.js server
        await sendServerDataToNodeServer(d3Data);
    }

    const homeServer = ns.getHostname();
    await bfsScanAndListDetails(ns, homeServer);
}
