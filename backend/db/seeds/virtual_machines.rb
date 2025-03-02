virtual_machines = [
  "Azure Virtual Machines",
  "Docker",
  "Google Compute Engine",
  "KVM",
  "Microsoft Hyper-V",
  "Parallels",
  "QEMU",
  "VMware",
  "VirtualBox",
  "Xen",
]

virtual_machines.each do |virtual_machine|
  VirtualMachine.find_or_create_by(name: virtual_machine)
end
