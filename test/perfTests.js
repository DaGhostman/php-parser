var should = require("should");
var parser = require('./main');

describe('Performance tests', function() {

  var code = [
    '<?php',
    'class foo extends bar {',
    '  const A = 1, B = 2, C = 3;',
    '  protected $foo = null;',
    '  public function __construct($a, $b, $c, array $d = []) {',
    '    echo $a . $b . $c . implode(";", $d);',
    '  }',
    '  static public function bar(): foo {',
    '    return new self(1, 2, 3);',
    '  }',
    '}'
  ].join('\n');

  it('tokenizer', function() {
    var reader = new parser();
    var tokSize = reader.tokenGetAll(code).length;
    var hrTime = process.hrtime();
    var iter = 500;
    var start = hrTime[0] * 1000000 + hrTime[1] / 1000;
    for(var i = 0; i < iter; i++) {
      reader.tokenGetAll(code);
    }
    hrTime = process.hrtime();
    var end = hrTime[0] * 1000000 + hrTime[1] / 1000;
    var duration = (end - start) / 1000; // in MS
    var speed = 1000 / duration * (tokSize * iter);
    // speed.should.be.greaterThan(10e5 * 0.8);

    if (speed > 1000) {
      speed = speed / 1000;
      if (speed > 1000) {
        speed = speed / 1000;
        speed = (Math.round(speed * 100) / 100) + 'M';
      } else {
        speed = (Math.round(speed * 100) / 100) + 'K';
      }
    }
    console.log('    + Tokens speed  => ' + speed + '/sec'); 

    speed = 1000 / duration * (code.length * iter);
    // speed.should.be.greaterThan(10e5 * 2 * 0.8);

    if (speed > 1024) {
      speed = speed / 1024;
      if (speed > 1024) {
        speed = speed / 1024;
        speed = (Math.round(speed * 100) / 100) + 'M';
      } else {
        speed = (Math.round(speed * 100) / 100) + 'K';
      }
    }
    console.log('    + Reading speed => ' + speed + '/sec'); 
  });

  it('parser', function() {
    var reader = new parser();
    var nodeSize = 0;
    var countNode = function(node) {
      nodeSize ++;
      for(var k in node) {
        if (node[k]) {
          if (node[k].kind) {
            countNode(node[k]);
          } else if (Array.isArray(node[k])) {
            for(var i = 0; i < node[k].length; i++) {
              if (node[k][i].kind) {
                countNode(node[k][i]);
              }
            }
          }  
        }
      }
    };
    countNode(reader.parseCode(code));

    var hrTime = process.hrtime();
    var iter = 500;
    var start = hrTime[0] * 1000000 + hrTime[1] / 1000;
    for(var i = 0; i < iter; i++) {
      reader.parseCode(code);
    }
    hrTime = process.hrtime();
    var end = hrTime[0] * 1000000 + hrTime[1] / 1000;
    var duration = (end - start) / 1000; // in MS
    var speed = 1000 / duration * (nodeSize * iter);
    // speed.should.be.greaterThan(10e4);

    if (speed > 1000) {
      speed = speed / 1000;
      if (speed > 1000) {
        speed = speed / 1000;
        speed = (Math.round(speed * 100) / 100) + 'M';
      } else {
        speed = (Math.round(speed * 100) / 100) + 'K';
      }
    }
    console.log('    + Nodes speed  => ' + speed + '/sec'); 

    speed = 1000 / duration * (code.length * iter);
    // speed.should.be.greaterThan(10e5 * 1 * 0.8);

    if (speed > 1024) {
      speed = speed / 1024;
      if (speed > 1024) {
        speed = speed / 1024;
        speed = (Math.round(speed * 100) / 100) + 'M';
      } else {
        speed = (Math.round(speed * 100) / 100) + 'K';
      }
    }
    console.log('    + Overall speed => ' + speed + '/sec'); 
    
  });

});