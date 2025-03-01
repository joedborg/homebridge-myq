/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* jshint node: true,esversion: 9, -W014, -W033 */
/* eslint-disable new-cap */
'use strict';

import { HomebridgePluginUiServer } from "@homebridge/plugin-ui-utils";
import * as fs from "node:fs";

class PluginUiServer extends HomebridgePluginUiServer {
  constructor () {
    super();

    /*
      A native method getCachedAccessories() was introduced in config-ui-x v4.37.0
      The following is for users who have a lower version of config-ui-x
    */
    this.onRequest('/getCachedAccessories', async () => {
      try {
        // Define the plugin and create the array to return
        const plugin = 'homebridge-myq';
        const devicesToReturn = [];

        // The path and file of the cached accessories
        const accFile = this.homebridgeStoragePath + '/accessories/cachedAccessories';

        // Check the file exists
        if (fs.existsSync(accFile)) {
          // Read the cached accessories file
          let cachedAccessories = await fs.promises.readFile(accFile);

          // Parse the JSON
          cachedAccessories = JSON.parse(cachedAccessories);

          // We only want the accessories for this plugin
          cachedAccessories
            .filter(accessory => accessory.plugin === plugin)
            .forEach(accessory => devicesToReturn.push(accessory));
        }

        // Return the array
        return devicesToReturn;
      } catch (err) {
        // Just return an empty accessory list in case of any errors
        return [];
      }
    });
    this.ready();
  }
}

(() => new PluginUiServer())();
