class HotelMap {
    
    instructionsFromNodeI = {
        'A' : [{instruction: 'F35', newPosition: 'H'},{instruction: 'L', newPosition:'H'},{instruction: 'F75', newPosition: 'C'},{instruction: 'R', newPosition: 'C'},{instruction: 'F65', newPosition: 'A'}],
        'B' : [{instruction: 'F35', newPosition: 'H'},{instruction: 'L', newPosition:'H'},{instruction: 'F75', newPosition: 'C'},{instruction: 'R', newPosition: 'C'},{instruction: 'F35', newPosition: 'B'}],
        'C' : [{instruction: 'F35', newPosition: 'H'},{instruction: 'L', newPosition:'H'},{instruction: 'F75', newPosition: 'C'}],
        'D' : [{instruction: 'F35', newPosition: 'H'},{instruction: 'L', newPosition:'H'},{instruction: 'F75', newPosition: 'C'},{instruction: 'L', newPosition: 'C'},{instruction: 'F35', newPosition: 'D'}],
        'E' : [{instruction: 'F35', newPosition: 'H'},{instruction: 'L', newPosition:'H'},{instruction: 'F75', newPosition: 'C'},{instruction: 'L', newPosition: 'C'},{instruction: 'F65', newPosition: 'E'}],
        'F' : [{instruction: 'F100', newPosition: 'F'}],
        'G' : [{instruction: 'F70', newPosition: 'G'}],
        'H' : [{instruction: 'F35', newPosition: 'H'}],
        'I' : [],
        'J' : [{instruction: 'B30', newPosition: 'J'}],
        'K' : [{instruction: 'I', newPosition: 'K'}]
    };

    reverse = {
        'L' : 'R',
        'R' : 'L',
        'F' : 'B',
        'B' : 'F',
        'I' : 'O',
        'O' : 'I'
    };

    getInstructions(currentNode, destinationNode) {
        if(currentNode == destinationNode) return [];
        let base = this.instructionsFromNodeI[destinationNode];
        if(currentNode == 'I') return base;
        if(currentNode == 'J') return this.getInstructionsToNodeI('J').concat([...base]); //Beware of recursion
        if(currentNode == 'K') {
            let x = [...base];
            x.unshift({instruction: 'O', newPosition: 'K'});
            return x;
        }
        
        let reversedBase = this.getInstructionsToNodeI(currentNode);
        if(destinationNode == 'I') return reversedBase;
        if(destinationNode == 'J') return [...reversedBase].concat(instructionFromNodeI['J']);
        if(destinationNode == 'K') return [...reversedBase].concat(instructionFromNodeI['K']);

        if(destinationNode != 'I' || destinationNode != 'J' || destinationNode != 'K') {
            throw "Unsupported combination of starting point and destination";
        }
    }

    getInstructionsToNodeI(currentNode) {
        let reversedInstructions = [];
        let base = this.instructionsFromNodeI[currentNode];
        for(let i=base.length; i>0; i--) {
            let currentInstruction = base[i];
            reversedInstructions.push({
                instruction: this.reverse(currentInstruction),
                newPosition: base[i-1].newPosition
            });
        }
        reversedInstructions.push({
            instruction: this.reverse(base[0]),
            newPosition: 'I'
        });
        return reversedInstructions;
    }

    reverse(instruction) {
        let type = instruction.instruction[0];
        let distance = instruction.substring(1);
        return mapping[type] + distance;
    }
}

module.exports = HotelMap;