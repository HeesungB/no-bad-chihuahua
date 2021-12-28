#!/bin/bash

echo "Enter your mnemonic";
read MNEMONIC

if [ "${MNEMONIC}" == "" ]
then
	echo "Need your MNEMONIC!"
	exit
fi

yarn start "${MNEMONIC}" &

