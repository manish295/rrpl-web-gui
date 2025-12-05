import rasterio
import rasterioxyz
from rasterio.merge import merge
import glob
import os

# List all TIFF files
tiff_files = glob.glob("*.tif")

print(len(tiff_files))
print(tiff_files)
# Open all the TIFF files
src_files = [rasterio.open(file) for file in tiff_files]

# Merge the files, keeping all bands
print('Merging...')
merged, transform = merge(src_files)
print('Merged!')

# Get metadata from the first file
meta = src_files[0].meta.copy()

# Update metadata to reflect the new dimensions
meta.update({
    "driver": "GTiff",
    "height": merged.shape[1],
    "width": merged.shape[2],
    "transform": transform,
    "count": merged.shape[0],  # Update the number of bands
    "dtype": merged.dtype,
})

print('Meta data updated')

# Save the merged file
print('Saving file to sattelite.tif...')


with rasterio.open("sattelite.tif", "w", **meta) as dst:
    dst.write(merged)


# Close all source files
for src in src_files:
    src.close()

print('File saved!')


img = rasterio.open("sattelite.tif")
print('Generating tiles...')

path = './react_gui/public/gps-info/Tiles'
folders = [f for f in os.listdir(path) if os.path.isdir(os.path.join(path, f))]

if len(folders) != 0:
    tiled = rasterioxyz.Tiles(image=img, zooms=range(int(folders[0]), int(folders[-1]) + 1), resampling="bilinear", )
else:
    tiled = rasterioxyz.Tiles(image=img, zooms=range(11, 16), resampling="bilinear", )



tiled.write("./react_gui/public/gps-info/sattelite")
print('Tiles generated! Saved to sattelite')
