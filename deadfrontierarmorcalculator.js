$(document).ready(function () { 
    //Code (mostly) by Rebekah#9014 of the Dead Frontier Discord.
    //This started as a way to practice Javascript,
    //it was programmed as a continuation from the Damage Calculator.
    //Credit to the many Dead Frontier Wiki contributors
    //for the armor and enemy data used in the json files as well as
    //the armor damage formulas. Thanks to Clayton for clarifying some
    //aspects of said formulas. And, as always, massive thanks to awoo
    //for constantly helping me out whenever I ran into issues
    //getting my code to work :).

    //#region Local variables
    let health = 50;
    let durability = 0;
    let absorption = 0;
    let selectedZone;
    let enduranceValue = 25;
    let enduranceBoost = 0;
    let boostValue = 0;
    //#endregion

    //#region Functions
    function makeForeignRequest(url, callback) //JSON pull function (credit to awoo, tyvm fren)
    {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if(this.readyState === 4)
            {
                if(this.status === 200)
                {
                    callback(this.responseText);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }
    
    function parseOutItemArray(data) //Armorss parse function (Credit to Awoo 2: Credit Harder)
    {
        let jsonData = JSON.parse(data);
        let mainSelect = document.getElementById("armorSelection");
        jsonData.forEach((val) =>
        {
            let group = document.createElement("optgroup"); //Create <optgroup> elements
            group.label = val["cat"];
            mainSelect.appendChild(group);
    
            val["items"].forEach((val2) =>
            {
                let option = document.createElement("option"); //Create <option> elements
                option.value = val2["name"];
                option.textContent = val2["name"];
                option.dataset.durability = val2["durability"];
                option.dataset.absorption = val2["absorption"];
                mainSelect.appendChild(option);
            });
        });
    }
    
    function parseOutZoneArray(data) //Zones parse function (adapted from above, so Credit to Awoo 3: Credit Halfer) 
    {
        let jsonData = JSON.parse(data);
        let mainSelect = document.getElementById("zoneSelection");
        jsonData.forEach((val) =>
        {
            let zone = document.createElement("option"); //Create <option> elements
            zone.dataset.name = val["cat"];
            zone.textContent = val["cat"];
            mainSelect.appendChild(zone);

            let subSelect = document.getElementById("calculatorResultsTable") //Select table
            let body = document.createElement("tbody"); //Create <tbody> elements & populate table
            body.id = val["cat"];
            subSelect.appendChild(body);
    
            val["items"].forEach((val2) =>
            {
                let dataRow = document.createElement("tr"); //Create <tr> elements & populate <tbody>
                body.appendChild(dataRow);

                let data1 = document.createElement("td"); //Create <td> elements & populate <tr>
                data1.className = "name";
                data1.textContent = val2["name"];
                dataRow.appendChild(data1);

                let data2 = document.createElement("td");
                data2.className = "melee";
                data2.dataset.damage = val2["melee"];
                dataRow.appendChild(data2);

                let data3 = document.createElement("td");
                data3.className = "vomit";
                data3.dataset.damage = val2["vomit"];
                dataRow.appendChild(data3);

                let data4 = document.createElement("td");
                data4.className = "explosion";
                data4.dataset.damage = val2["explosion"];
                dataRow.appendChild(data4);

                let data5 = document.createElement("td");
                data5.className = "DTB";
                dataRow.appendChild(data5);

                let data6 = document.createElement("td");
                data6.className = "DTK";
                dataRow.appendChild(data6);

                let data7 = document.createElement("td");
                data7.className = "HTB";
                dataRow.appendChild(data7);

                let data8 = document.createElement("td");
                data8.className = "HTK";
                dataRow.appendChild(data8);

                let data9 = document.createElement("td");
                data9.className = "meleeS";
                dataRow.appendChild(data9);

                let data10 = document.createElement("td");
                data10.className = "vomitS";
                dataRow.appendChild(data10);

                let data11 = document.createElement("td");
                data11.className = "explosionS";
                dataRow.appendChild(data11);

                let data12 = document.createElement("td");
                data12.className = "idrReq";
                dataRow.appendChild(data12);
            });
        });
    }

    function armorUpdate() { //Armor update function
        durability = parseInt(this.options[this.selectedIndex].dataset.durability); //Set values
        absorption = parseFloat(this.options[this.selectedIndex].dataset.absorption);

        document.getElementById('baseDurability').textContent = durability; //Display values
        document.getElementById('baseAbsorption').textContent = "("+Math.floor(absorption * 100)+"%)";
    };

    function bonusUpdate () { //Armor bonus update function
        enduranceBoost = parseInt(this.value);
    };

    function enduranceUpdate () { //Endurance update function
        enduranceValue = parseInt(this.value);
        health = 50 + ((enduranceValue - 25) * 2);
    };

    function boostUpdate () { //Boost update function
        boostValue = (parseInt(this.value) / 100);
    };

    function tableUpdate () { //Table update function
        let selectedZoneTable = document.getElementById(selectedZone); //Select <tbody> by zone selection index
        document.querySelectorAll("input").forEach(element => element.disabled = true);
        document.querySelectorAll("select").forEach(element => element.disabled = true);

        Array.prototype.forEach.call(selectedZoneTable.children, child => { //Array from HTMLCollection of <tbody> children
            const meleeSelector = child.querySelector(".melee"); //Store element selectors
            const vomitSelector = child.querySelector(".vomit");
            const explosionSelector = child.querySelector(".explosion");
            const dtbSelector = child.querySelector(".DTB");
            const dtkSelector = child.querySelector(".DTK");
            const htbSelector = child.querySelector(".HTB");
            const htkSelector = child.querySelector(".HTK");
            const meleeSSelector = child.querySelector(".meleeS");
            const vomitSSelector = child.querySelector(".vomitS");
            const explosionSSelector = child.querySelector(".explosionS");
            const idrReqSelector = child.querySelector(".idrReq");

            let melee = parseInt(meleeSelector.dataset.damage); //Set values
            let meleeDisplay = Math.ceil(melee - (melee * boostValue));
            let vomit = parseInt(vomitSelector.dataset.damage);
            let vomitDisplay = Math.ceil(vomit - (vomit * boostValue));
            let explosion = parseInt(explosionSelector.dataset.damage);
            let explosionDisplay = Math.ceil(explosion - (explosion * boostValue));
            let damage = melee;
            let damageType = "melee";
            let healthDamage = (1 - absorption);
            let htbMelee = 0;
            let htkMelee = 0;
            let dtbMelee = 0;
            let dtkMelee = 0;
            let htbVomit = 0;
            let htkVomit = 0;
            let dtbVomit = 0;
            let dtkVomit = 0;
            let htbExplosion = 0;
            let htkExplosion = 0;
            let dtbExplosion = 0;
            let dtkExplosion = 0;
            let meleeSurvivable;
            let vomitSurvivable;
            let explosionSurvivable;
            let idrReqMelee;
            let idrReqVomit;
            let idrReqExplosion;

            /*
            let meleeIDR = Math.ceil(melee * boostValue); //Calculate melee damage
            let meleeArmor = Math.ceil((melee - meleeIDR) * absorption);
            if (meleeArmor > durability) {
                meleeArmor = durability
            } else if (meleeArmor < 1) {
                meleeArmor = 1;
            };
            let meleeEnd = ((melee - meleeIDR - meleeArmor) * (enduranceBoost / (enduranceValue + enduranceBoost)))
            let meleeHealth = Math.ceil(melee - meleeIDR - meleeArmor - meleeEnd);
            if (meleeHealth < 1) {
                meleeHealth = 1;
            };

            let vomitIDR = Math.ceil(vomit * boostValue); //Calculate vomit damage
            let vomitArmor = Math.ceil((vomit - vomitIDR) * absorption);
            if (vomitArmor > durability) {
                vomitArmor = durability
            } else if (vomitArmor < 1) {
                vomitArmor = 1;
            };
            let vomitEnd = ((vomit - vomitIDR - vomitArmor) * (enduranceBoost / (enduranceValue + enduranceBoost)))
            let vomitHealth = Math.ceil(vomit - vomitIDR - vomitArmor - vomitEnd);

            let explosionIDR = Math.ceil(explosion * boostValue); //Calculate explosion damage
            let explosionArmor = Math.ceil((explosion - explosionIDR) * absorption);
            if (explosionArmor > durability) {
                explosionArmor = durability
            } else if (explosionArmor < 1) {
                explosionArmor = 1;
            };
            let explosionEnd = ((explosion - explosionIDR - explosionArmor) * (enduranceBoost / (enduranceValue + enduranceBoost)))
            let explosionHealth = Math.ceil(explosion - explosionIDR - explosionArmor - explosionEnd);
            */

            //#region Damage testing
            while (damageType != "") {
                let testDura = durability; //Sanitized test values
                let testHtb = 0;
                let testHealth = health;
                let testHtk = 0;
                let iteration = 1;
                while (testDura > 0 && testHealth > 0) { //Before break or death
                    let absorbedDmg = Math.floor(damage * boostValue);
                    let armorDmg = Math.floor((damage - absorbedDmg) * absorption);
                    if (armorDmg == 0 && testDura > 0) {
                        armorDmg = 1;
                    } else if (armorDmg > testDura) {
                        armorDmg = testDura;
                    };
                    let armorEndReduction = ((damage - absorbedDmg - armorDmg) * (enduranceBoost / (enduranceValue + enduranceBoost)))
                    let hpDmg = Math.floor(damage - absorbedDmg - armorDmg - armorEndReduction);
                    if (hpDmg == 0 && testHealth > 0) {
                        hpDmg = 1;
                    } else if (hpDmg > testHealth) {
                        hpDmg = testHealth;
                    };

                    testDura = testDura - armorDmg;
                    testHealth = testHealth - hpDmg;
            
                    if (testDura <= 0) {
                        testHtb = iteration;
                    };

                    if (testHealth <= 0) {
                        testHtk = iteration;
                    };

                    iteration++;
                };

                while (testDura > 0) { //After death w/ no break
                    let absorbedDmg = Math.floor(damage * boostValue);
                    let armorDmg = Math.floor((damage - absorbedDmg) * absorption);
                    if (armorDmg == 0 && testDura > 0) {
                        armorDmg = 1;
                    } else if (armorDmg > testDura) {
                        armorDmg = testDura;
                    };
                    let armorEndReduction = ((damage - absorbedDmg - armorDmg) * (enduranceBoost / (enduranceValue + enduranceBoost)))
                    let hpDmg = Math.floor(damage - absorbedDmg - armorDmg - armorEndReduction);
                    if (hpDmg == 0 && testHealth > 0) {
                        hpDmg = 1;
                    } else if (hpDmg > testHealth) {
                        hpDmg = testHealth;
                    };

                    testDura = testDura - armorDmg;

                    if (testDura <= 0) {
                        testHtb = iteration;
                    };

                    iteration++;
                };

                while (testHealth > 0) { //After break w/ no death
                    let absorbedDmg = Math.floor(damage * boostValue);
                    let armorDmg = Math.floor((damage - absorbedDmg) * absorption);
                    if (armorDmg == 0 && testDura > 0) {
                        armorDmg = 1;
                    } else if (armorDmg > testDura) {
                        armorDmg = testDura;
                    };
                    let armorEndReduction = ((damage - absorbedDmg - armorDmg) * (enduranceBoost / (enduranceValue + enduranceBoost)))
                    let hpDmg = Math.floor(damage - absorbedDmg - armorDmg - armorEndReduction);
                    if (hpDmg == 0 && testHealth > 0) {
                        hpDmg = 1;
                    } else if (hpDmg > testHealth) {
                        hpDmg = testHealth;
                    };

                    testHealth = testHealth - hpDmg;

                    if (testHealth <= 0) {
                        testHtk = iteration;
                    };

                    iteration++;
                };

                if (damageType == "melee") { //Loop through damage types
                    htbMelee = testHtb;
                    htkMelee = testHtk;
                    if (melee > 0) {
                        dtbMelee = Math.ceil(testHtb * (damage - (damage * boostValue)));
                        dtkMelee = Math.ceil(testHtk * (damage - (damage * boostValue)));
                    } else {
                        dtbMelee = 0;
                        dtkMelee = 0;
                    };

                    damage = vomit;
                    damageType = "vomit";

                    console.log(damageType);
                } else if (damageType == "vomit") {
                    htbVomit = testHtb;
                    htkVomit = testHtk;
                    if (vomit > 0) {
                        dtbVomit = Math.ceil(testHtb * (damage - (damage * boostValue)));
                        dtkVomit = Math.ceil(testHtk * (damage - (damage * boostValue)));
                    } else {
                        dtbVomit = 0;
                        dtkVomit = 0;
                    };

                    damage = explosion;
                    damageType = "explosion";
                } else if (damageType == "explosion") {
                    htbExplosion = testHtb;
                    htkExplosion = testHtk;
                    if (explosion > 0) {
                        dtbExplosion = Math.ceil(testHtb * (damage - (damage * boostValue)));
                        dtkExplosion = Math.ceil(testHtk * (damage - (damage * boostValue)));
                    } else {
                        dtbExplosion = 0;
                        dtkExplosion = 0;
                    };

                    damageType = "";
                };
            };
            //#endregion

            meleeSelector.textContent = meleeDisplay;
            vomitSelector.textContent = vomitDisplay;
            explosionSelector.textContent = explosionDisplay;

            if (document.getElementById('armorSelection').value != "Please Select an Option") { //Element visibility
                if (melee > 0) { //Calculate values
                    if (htkMelee > 1 && htbMelee > 1) {
                        meleeSurvivable = "Yes";
                    } else if (htkMelee > 1 && htbMelee == 1) {
                        meleeSurvivable = "Broken";
                    } else {
                        meleeSurvivable = "No";
                    };

                    idrReqMelee = Math.floor(((melee - (dtkMelee - 1)) / (dtkMelee - 1)) * 100);
                    if (idrReqMelee < 0) {
                        idrReqMelee = 0;
                    };
                } else {
                    htbMelee = "N/A";
                    htkMelee = "N/A";
                    meleeSurvivable = "N/A";
                    idrReqMelee = 0;
                };
                if (vomit > 0) {
                    if (htkVomit > 1 && htbVomit > 1) {
                        vomitSurvivable = "Yes";
                    } else if (htkVomit > 1 && htbVomit == 1) {
                        vomitSurvivable = "Broken";
                    } else {
                        vomitSurvivable = "No";
                    };

                    idrReqVomit = Math.floor(((vomit - (dtkVomit - 1)) / (dtkVomit - 1)) * 100);
                    if (idrReqVomit < 0) {
                        idrReqVomit = 0;
                    };
                } else {
                    htbVomit = "N/A";
                    htkVomit = "N/A";
                    vomitSurvivable = "N/A";
                    idrReqVomit = 0;
                };
                if (explosion > 0) {
                    if (htkExplosion > 1 && htbExplosion > 1) {
                        explosionSurvivable = "Yes";
                    } else if (htkExplosion > 1 && htbExplosion == 1) {
                        explosionSurvivable = "Broken";
                    } else {
                        explosionSurvivable = "No";
                    };

                    idrReqExplosion = Math.floor(((explosion - (dtkExplosion - 1)) / (dtkExplosion - 1)) * 100);
                    if (idrReqExplosion < 0) {
                        idrReqExplosion = 0;
                    };
                } else {
                    htbExplosion = "N/A";
                    htkExplosion = "N/A";
                    explosionSurvivable = "N/A";
                    idrReqExplosion = 0;
                };

                console.log(typeof(dtbMelee));
                console.log(typeof(dtbVomit));
                console.log(typeof(dtbExplosion));

                dtbSelector.textContent = dtbMelee+", "+dtbVomit+", "+dtbExplosion; //Display values
                dtkSelector.textContent = dtkMelee+", "+dtkVomit+", "+dtkExplosion;
                htbSelector.textContent = htbMelee+", "+htbVomit+", "+htbExplosion;
                htkSelector.textContent = htkMelee+", "+htkVomit+", "+htkExplosion;

                meleeSSelector.textContent = meleeSurvivable; //Diplay Survivable Melee
                if (meleeSurvivable == "Yes") {
                    meleeSSelector.style.backgroundColor = "lightgreen";
                } else if (meleeSurvivable == "Broken") {
                    meleeSSelector.style.backgroundColor = "khaki";
                } else if (meleeSurvivable == "No") {
                    meleeSSelector.style.backgroundColor = "lightcoral";
                } else {
                    meleeSSelector.style.backgroundColor = "";
                }
                vomitSSelector.textContent = vomitSurvivable; //Diplay Survivable Melee
                if (vomitSurvivable == "Yes") {
                    vomitSSelector.style.backgroundColor = "lightgreen";
                } else if (vomitSurvivable == "Broken") {
                    vomitSSelector.style.backgroundColor = "khaki";
                } else if (vomitSurvivable == "No") {
                    vomitSSelector.style.backgroundColor = "lightcoral";
                } else {
                    vomitSSelector.style.backgroundColor = "";
                }
                explosionSSelector.textContent = explosionSurvivable; //Diplay Survivable Melee
                if (explosionSurvivable == "Yes") {
                    explosionSSelector.style.backgroundColor = "lightgreen";
                } else if (explosionSurvivable == "Broken") {
                    explosionSSelector.style.backgroundColor = "khaki";
                } else if (explosionSurvivable == "No") {
                    explosionSSelector.style.backgroundColor = "lightcoral";
                } else {
                    explosionSSelector.style.backgroundColor = "";
                }

                if (idrReqMelee > 79 && idrReqVomit > 79 && idrReqExplosion > 79) { //Display IDR% Required
                    idrReqSelector.textContent = "Impossible, Impossible, Impossible";
                } else if (idrReqMelee > 79 && idrReqVomit > 79) {
                    idrReqSelector.textContent = "Impossible, Impossible,"+idrReqExplosion+"%";
                } else if (idrReqVomit > 79 && idrReqExplosion > 79) {
                    idrReqSelector.textContent = idrReqMelee+"%, Impossible, Impossible";
                } else if (idrReqMelee > 79) {
                    idrReqSelector.textContent = "Impossible, "+idrReqVomit+"%, "+idrReqExplosion+"%";
                } else if (idrReqVomit > 79) {
                    idrReqSelector.textContent = idrReqMelee+"%, Impossible, "+idrReqExplosion+"%";
                } else if (idrReqExplosion > 79) {
                    idrReqSelector.textContent = idrReqMelee+"%, "+idrReqVomit+"%, Impossible";
                } else {
                    idrReqSelector.textContent = idrReqMelee+"%, "+idrReqVomit+"%, "+idrReqExplosion+"%";
                };
            } else {
                dtbSelector.textContent = ""; //Hide element
                dtkSelector.textContent = "";
                htbSelector.textContent = "";
                htkSelector.textContent = "";
                meleeSSelector.textContent = "";
                vomitSSelector.textContent = "";
                explosionSSelector.textContent = "";
                idrReqSelector.textContent = "";
            };
        });

        setTimeout(() => {
            document.querySelectorAll("input").forEach(element => element.disabled = false);
            document.querySelectorAll("select").forEach(element => element.disabled = false);
        }, "1000");
    };
    //#endregion

    //#region Active code
    makeForeignRequest("armors.json", parseOutItemArray); //Pull JSON & parse
    makeForeignRequest("zones.json", parseOutZoneArray);

    $("#armorSelection").on('change', function() { //Weapon selection change function
        armorUpdate.call(this);

        if (document.getElementById('zoneSelection').value != "Please Select an Option") { //Call table update function
            tableUpdate();
        };
    });

    $("#endBonus").on('change', function() { //Boost entry change function
        if (this.value > 24) {
            this.value = 24;
        } else if (this.value < 0) {
            this.value = 0;
        } else if (this.value == "") {
            this.value = 0;
        };

        bonusUpdate.call(this);

        if (document.getElementById('zoneSelection').value != "Please Select an Option") { //Call table update function
            tableUpdate();
        };
    });

    $("#zoneSelection").on('change', function() { //Zone selection change function
        selectedZone = this.options[this.selectedIndex].dataset.name; //Store selection index
        let tables = document.getElementsByTagName("tbody"); //Select & store all <tbody> elements

        for (tbody of tables) { //Default selected elements to invisible
            tbody.style.display = "none";
        };

        if (document.getElementById('zoneSelection').value != "Please Select an Option") { //Display <tbody> for selection index
            document.getElementById(selectedZone).style.display = "table-row-group";

            tableUpdate(); //Call table update function
        };
    });

    $("#enduranceValue").on('change', function() { //Boost entry change function
        if (this.value > 100) {
            this.value = 100;
        } else if (this.value < 25) {
            this.value = 25;
        } else if (this.value == "") {
            this.value = 25;
        };

        enduranceUpdate.call(this);

        if (document.getElementById('zoneSelection').value != "Please Select an Option") { //Call table update function
            tableUpdate();
        };
    });

    $("#boostValue").on('change', function() { //Boost entry change function
        if (this.value > 79) {
            this.value = 79;
        } else if (this.value < 0) {
            this.value = 0;
        } else if (this.value == "") {
            this.value = 0;
        };

        boostUpdate.call(this);

        if (document.getElementById('zoneSelection').value != "Please Select an Option") { //Call table update function
            tableUpdate();
        };
    });
    //#endregion
});