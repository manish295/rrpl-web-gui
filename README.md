# RRPL Web GUI
RPL GUI for visualizing real-time telemetry data. Client side is built using React and Server side is built in Python. The server handles incoming packets from the board and sends it the client via websockets to be displayed in the GUI.

## First Time Set Up
1) Clone the repo
    ```
    gh repo clone Rutgers-RPL/socket-rocket
    ```
2) Install the required python packages
    ```
    pip install requirements.txt
    ```
3) Navigate to the GUI
    ```
    cd react-gui
    ```
4) Install the required node packages
    ```
    npm install i
    ```

## Running the GUI
### GUI
1) Navigate to react-gui
    ```
    cd react-gui
    ```
2) Run the following command
    ```
    npm start dev
    ```
### Server
1) Plug in the board **prior** to running the server
2) Run the following command
    ```
    python server.py
    ```
3) The server will prompt you to select the port by inputting the corresponding number\
    **Note**: If the board gets disconnected, you must **restart** the server.


## Maps Set Up

## NOTE: Setting up Sattelite maps will take some time. It's recommended to use pre-downloaded maps [here](https://drive.google.com/drive/folders/1_mppBWiT4dvveJHQujdgvaxjKuk3gEIj)
Download > Extract > paste sattelite and Tiles in react-gui/public/gps-info

##

### Open Street Maps
1) Download [Maperitive](http://maperitive.net/)
2) Navigate to [Open Street Maps](https://www.openstreetmap.org/)

3) Click **"Export"** and select **"Manually select a different area"** on the sidebar on the left.
    ![Error Displaying Image!](/img/osm.png "OSM Export")

4) Chose the desired area and click export, which will download a .osm file
   
   **Note**: Sometimes the area might too large/contain too many objects so you may have to re-size until OSM lets you export it
   

5) Open Maperitive, navigate to the top bar and click **Map > Clear Map**. Then navigate to **File > Open Map Sources** and select the downloaded .osm file.
    ![Error Displaying Image!](/img/maperitive-toolbar.png "Toolbar")
    

    ![Error Displaying Image!](/img/maperitive-clear.png "Clear Map")

    ![Error Displaying Image!](/img/maperitive-openmap.png "Open Map Sources")



6) Still in Maperitive, navigate to **Tools > Generate Tiles**. This will generate tiles and place them in the "Tiles" folder, which is in the same directory as Maperitive.exe
    ![Error Displaying Image!](/img/maperitive-generate.png "Generate Tiles")
    ![Error Displaying Image!](/img/maperitive-tiles.png "Tiles Folder")


7) Copy-paste the "Tiles" folder (found in the same directory as Maperitive) into **react-gui/public/gps-info**

8) To generate new tiles, navigate to **Tools > Clear Web Cache** to delete the existing tiles or manually delete them from the "Tiles" folder. Then repeat the steps above.


### Sattelite Map
1) Navigate to [USGS Earth Explorer](https://earthexplorer.usgs.gov/) and create an account if you don't have one

2) On "Search Criteria" use either "Polygon" or "Circle" to select the desired area

    ![Error Displaying Image!](/img/search.png "USGS Search Location")

   **Polygon**: "Use Map" selects the current viewing area, "Add coordinate" allows for manual input of coordinates of each corner

   **Circle**: Enter a center lat/long with a specified radius

3) Click **Data Sets** > Search for **NAIP** in the search bar > Select the **NAIP** check box
    ![Error Displaying Image!](/img/data_sets.png "USGS Data Sets")

4) Proceed to **Results**, all available maps are displayed in the results area
   
5) Using the **Footprint** icon, highlight all maps that cover the selected area 
    ![Error Displaying Image!](/img/results.png "USGS Data Sets")

6) For each highlighted map: click **Download Options** > Download **Full Resolution**

    ![Error Displaying Image!](/img/download_options.png "USGS Data Sets")

    **Note**: This may take a while depending on how big the area is

7) Extract the downloaded folders, copy the .tif files in each folder, and paste them in the root directory of the repo (/socket-rocket)
    ![Error Displaying Image](/img/tif_file.png "Tif Image")

8) Run the following command, which will merge all the .tif files and divide them into xyz tiles (no need to paste them into public/gps-info)
    ```
    python sat_script.py
    ```

    **Note**: **This will take some time** depending on how many big/how many files there are to merge

9) Repeat to generate a new set of tiles, but ensure that previous .tif images are deleted before running the script
   
