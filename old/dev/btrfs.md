# How to setup WebDav on Ubuntu

Tested on Ubuntu 16.04

```sh
# Create a subvolume
btrfs subvolume create test

# Create a snapshot from subvolume test
btrfs subvolume snapshot test snapshot

# List subvolumes related to test (root required)
sudo btrfs subvolume list test

# Delete a subvolume (root required)
sudo btrfs subvolume delete test
```
