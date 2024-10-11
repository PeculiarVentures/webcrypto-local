# Developers Guide

Welcome to the Developers Guide for this project. This document provides essential information and instructions for developers working on the project. It includes guidelines for setting up the development environment, managing dependencies, running tests, and other important tasks.

## Managing PCSC Service on Windows

For testing various states of the PCSC (Smart Card) service on Windows, you may need to start, stop, and change the startup type of the service. Below are the commands to manage the PCSC service.

**Note:** Ensure you open the terminal with administrative privileges to execute these commands.

### Disable and Stop the PCSC Service

To disable and stop the PCSC service, run the following commands in PowerShell with administrative privileges:

```powershell
# Disable the PCSC service
Set-Service -Name "SCardSvr" -StartupType Disabled

# Stop the PCSC service
Stop-Service -Name "SCardSvr"
```

### Enable and Start the PCSC Service

To enable and start the PCSC service, run the following commands in PowerShell with administrative privileges:

```powershell
# Set the PCSC service to start automatically
Set-Service -Name "SCardSvr" -StartupType Automatic

# Start the PCSC service
Start-Service -Name "SCardSvr"
```

### Check the Status of the PCSC Service

To check the current status of the PCSC service, run the following command in PowerShell:

```powershell
Get-Service -Name "SCardSvr"
```

This command will display the current status of the service, including whether it is running, stopped, and its startup type.

### Troubleshooting

If the PC/SC service is running but you are encountering the following errors:

- `The Smart Card Resource Manager is not running.`
- `PCSC_CANNOT_START`

Follow these steps to resolve the issue:

1. Press `Win + R` to open the Run dialog.
2. Type `services.msc` and press Enter.
3. In the **Services** window, locate the `Smart Cards` service (`SCardSvr`).
4. Check if the service is running:
   - If it is **not** running:
     - Right-click on the service and select **Start**.
     - Verify if this resolves the issue.
   
   If the issue persists, proceed with the following steps:
   
5. Open the service's preferences:
   - Right-click on the `Smart Cards` service and select **Properties**.
6. Navigate to the **Log On** tab.
7. Change the **Log on as** option to **This account**.
8. Enter `Local Service` and use your OS logon credentials as the password.

After making these changes, restart the service and check if the problem is resolved.