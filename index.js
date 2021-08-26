/* variables */
const initialGeneCount = 5; 
const nucelotideTypes = ['A','C','T','G'];
var strand1 = [['A','A','A'],['G','G','G'],['C','C','C']];
var strand2 = [['A','A','A'],['G','G','G'],['C','C','C']];
var strands = [strand1,strand2] ;
var boundRemoveNucleotide ;

/* functions */
function getGene() {
	let gene = [];
	for(i=0;i<3;i++) {
		let rand = Math.floor( Math.random() * nucelotideTypes.length );
		let nucleotide = nucelotideTypes[rand] ;
		gene.push(nucleotide);
	}
	return gene;
}

function initializeStrand( strandIndex ) {
	strands[strandIndex] = [];

	for(let i=0;i<initialGeneCount;i++) {
		let nextGene = getGene();
		strands[strandIndex].push(nextGene) ;
	}
}


function updateDisplay( strandIndex ) {
	var strand = strands[strandIndex];
	let strandBlob = "";

	strand.forEach( function(gene, i) {

		let nucleotideGroup = "";
		gene.forEach( function(nucleotide, j) {
			let nucelotide = `<button type='button' class='nucleotide' data-strandIndex='${strandIndex}' data-geneIndex='${i}' data-nucIndex='${j}'>${nucleotide}</button>` ;
			nucleotideGroup += nucelotide ;
		});

		let geneBlob = `<div class='gene'>${nucleotideGroup}</div>` ;
		strandBlob += geneBlob ;
	});

	// TO DO: generalize this:
	document.getElementById( "strand-1" ).innerHTML = strandBlob ;

	// re-add event listeners
	document.querySelectorAll( '.nucleotide' ).forEach( function(nucleotide){
		nucleotide.addEventListener( 'click', handleNucSelect );
	});
}


function removeNucleotide( e ) {
	document.removeEventListener('keydown', boundRemoveNucleotide );

	// if key was Delete ...
	if ( e.keyCode === 8 ){

		let strandIndex = parseInt( this.getAttribute('data-strandIndex') ) ;
		let strand = strands[strandIndex] ;
		let gene = parseInt( this.getAttribute('data-geneIndex') ) ;
		let nuc = parseInt( this.getAttribute('data-nucIndex') ) ;

		// remove selected nucleotide from data structure
		strand[gene].splice(nuc,1);

		// shift the strand
		for( let i=(gene+1);i<strand.length;i++ ) {
			strand[i-1].push( strand[i][0] );
			strand[i].splice(0,1);
		}

		// add nucleotide placeholder(s) at the end of the strand
		var lastGene = strand[strand.length-1];
		if ( lastGene.length < 3 ) {
			for( let i=0; i<(3-lastGene.length); i++ ) {
				lastGene.push( '?' );
			}
		}

		updateDisplay( strandIndex );
	}
}

function addNucleotide( e ) {
	// if the div.innerHTML is an empty string, do nothing
	if ( this.innerHTML !== "" ) {
		let strandIndex = parseInt( this.getAttribute('data-strandIndex') ) ;
		var strand = strands[strandIndex] ;
		let gene = parseInt( this.getAttribute('data-geneIndex') ) ;
		let nuc = parseInt( this.getAttribute('data-nucIndex') ) ;

		strand[gene][nuc] = this.innerHTML ;

		// remove text focus if user hits Enter
		this.addEventListener( 'keydown', function( e ) {
			if ( e.keyCode === 13 ) {
				this.classList.remove('contenteditable');
			}

			updateDisplay( strandIndex );
		} );
	}
}


function handleNucSelect( e ) {
	console.log( e );
	console.log( this );

	// deselect anything else and remove listeners
	let selected = this.parentElement.parentElement.querySelector( '.selected' ) ;
	if ( selected ) {
		selected.classList.remove( 'selected' );
		selected.removeEventListener('keydown', boundRemoveNucleotide );
		//selected.removeEventListener( 'input', addNucleotide );
	}

	// show new selection
	this.classList.add( 'selected' );

	// if an available space was selected, attach addNucleotide
	if ( this.innerHTML === '?' ) {
		e.target.setAttribute('contenteditable', 'true');
		e.target.addEventListener( 'input', addNucleotide );
	}
	// if the space is occupied, attach removeNucleotide
	else {
		this.addEventListener( 'keydown', removeNucleotide );
	}
}


/* on load */
window.onload = function() {
	//initializeStrand(0);
	updateDisplay(0);
}
